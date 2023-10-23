import { Command, Flags } from '@oclif/core';
import { searchForConfig } from '../../utils/conf-explorer';
import chalk = require('chalk');
import { cleanUpFilename } from '../../utils/util';
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
import { Answers } from 'inquirer';

interface Config {
  config: {
    config?: CleanRule[];
    filepath?: string;
    isEmpty?: boolean;
  };
}

interface MaidConfig {
  cleanRules: CleanRule[];
}

type ConfigOrNull = Config | null | undefined;

interface CleanRule {
  pattern?: string;
  dirName: string;
  applyInDir?: string[];
  fileExtension?: string[];
}

export class Clean extends Command {
  static description = 'Clean current directory';

  static flags = {
    global: Flags.boolean({
      char: 'g',
      description: 'Clean globally',
      required: false,
    }),
  };

  async moveFile(
    dirPath: string,
    dirName: string,
    fileName: string
  ): Promise<void> {
    const currentDirectory = dirPath;
    const currentPath = path.join(currentDirectory, fileName);
    const destinationPath = path.join(currentDirectory, dirName, fileName);

    try {
      await this.initDirectory(currentDirectory, dirName);
      await fs.promises.rename(currentPath, destinationPath);
      console.log('Moved file ' + fileName + ' to directory ' + dirName);
    } catch (error) {
      console.log(error);
    }
  }

  async initDirectory(currentDirectory: string, dirName: string): Promise<any> {
    const dirPath = path.join(currentDirectory, dirName);

    try {
      if (!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, { recursive: true }, (err: any) => {
          if (err) {
            return console.error(err);
          }

          console.log('Directory created successfully!');
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  isGitRepo(): boolean {
    return fs.existsSync(path.join(process.cwd(), '.git'));
  }

  isAtLeastOneRulePresent({
    pattern,
    fileExtension,
  }: CleanRule): boolean | undefined {
    return (
      (pattern && pattern !== '') || (fileExtension && fileExtension.length > 0)
    );
  }

  isValidPattern(cleanRule: CleanRule, filename: string): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'pattern') &&
      cleanRule.pattern
    ) {
      // normalize filename and remove soft-hyphens
      const normalizedFilename = cleanUpFilename(filename);
      const validationRule = new RegExp(cleanUpFilename(cleanRule.pattern));
      return validationRule.test(normalizedFilename);
    }

    return true;
  }

  isFileExtension(cleanRule: CleanRule, filename: string): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'fileExtension') &&
      cleanRule.fileExtension
    ) {
      const fileType = path.extname(filename);
      return cleanRule.fileExtension.includes(fileType);
    }

    return true;
  }

  isAppliedToCorrectDir(cleanRule: CleanRule, currentDir: string): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'applyInDir') &&
      cleanRule.applyInDir
    ) {
      return cleanRule.applyInDir.includes(currentDir);
    }

    return true;
  }

  async validateDirectoryAndMoveFiles(
    filename: string,
    config: MaidConfig,
    directory: string
  ): Promise<void> {
    for (const conf of config.cleanRules) {
      if (
        this.isAtLeastOneRulePresent(conf) &&
        this.isAppliedToCorrectDir(conf, directory) &&
        this.isValidPattern(conf, filename) &&
        this.isFileExtension(conf, filename)
      ) {
        await this.moveFile(directory, conf.dirName, filename);
      }
    }
  }

  async cleanGlobally(
    config: MaidConfig,
    configuration: Config
  ): Promise<void> {
    for (const conf of config.cleanRules) {
      if (conf.applyInDir && conf.applyInDir.length > 0) {
        for (const dir of conf.applyInDir) {
          await this.processDirectory(dir, configuration);
        }
      }
    }
  }

  async processDirectory(dir: string, configuration: Config) {
    try {
      await fs.promises.access(dir);
      console.log('\nCleaning in directory ' + chalk.greenBright(dir));
      await this.cleanDirectory(dir, configuration);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.error(chalk.yellowBright('\nDirectory does not exist:'), dir);
      } else {
        console.error('\nError accessing directory:', err);
      }
    }
  }

  async cleanDirectory(directory: string, config: Config): Promise<void> {
    try {
      const files = await fs.promises.readdir(directory);
      for (const file of files) {
        await this.processFile(file, directory, config);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async processFile(
    file: string,
    directory: string,
    config: Config
  ): Promise<void> {
    const filePath = path.join(directory, file);
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile()) {
      await this.validateDirectoryAndMoveFiles(
        file,
        config.config as MaidConfig,
        directory
      );
    }
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Clean);
    const config: ConfigOrNull = await searchForConfig();
    if (config && config.config) {
      if (this.isGitRepo()) {
        inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'continue',
              message:
                'Current directory appears to be a git repo - are you sure you want to continue?',
            },
          ])
          .then((answers: Answers) => {
            if (answers.continue) {
              const currentDirectory = process.cwd();
              this.cleanDirectory(currentDirectory, config);
            } else {
              console.log('Clean aborted.');
            }
          })
          .catch((error: string) => {
            console.log(error);
          });
      } else {
        if (flags.global) {
          this.cleanGlobally(config.config as MaidConfig, config);
        } else {
          const currentDirectory = process.cwd();
          this.cleanDirectory(currentDirectory, config);
        }
      }
    } else {
      console.log(
        chalk.redBright('No configuration found! - No config, no cleaning')
      );
      console.log(
        'To prevent you from accidentally or unwillingly moving files around,'
      );
      console.log(
        'maid requires instructions from you. Please create a ' +
          chalk.greenBright('.maidrc') +
          ' file'
      );
      console.log('and give maid instructions on how and where to clean.');
      console.log('Further information on the required instructions');
      console.log(
        'can be found at: ' +
          chalk.gray('https://github.com/McMuellermilch/maid-cli')
      );
    }
  }
}
