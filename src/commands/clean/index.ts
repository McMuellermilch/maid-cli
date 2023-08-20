import {Command} from '@oclif/core'
import {searchForConfig} from '../../utils/conf-explorer'
import chalk = require('chalk');
import {cleanUpFilename} from '../../utils/util'
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
import {Answers} from 'inquirer'

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

  moveFile(dirName: string, fileName: string): void {
    const currentDirectory = process.cwd()
    const currentPath = path.join(currentDirectory, fileName)
    const destinationPath = path.join(currentDirectory, dirName, fileName)

    this.initDirectory(currentDirectory, dirName)

    fs.rename(currentPath, destinationPath, function (err: any) {
      if (err) {
        throw err
      } else {
        console.log('Moved file ' + fileName + ' to directory ' + dirName)
      }
    })
  }

  async initDirectory(currentDirectory: string, dirName: string): Promise<any> {
    const dirPath = path.join(currentDirectory, dirName)

    try {
      if (!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, {recursive: true}, (err: any) => {
          if (err) {
            return console.error(err)
          }

          console.log('Directory created successfully!')
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  isGitRepo(): boolean {
    return fs.existsSync(path.join(process.cwd(), '.git'))
  }

  isAtLeastOneRulePresent({
    pattern,
    fileExtension,
  }: CleanRule): boolean | undefined {
    return (
      (pattern && pattern !== '') || (fileExtension && fileExtension.length > 0)
    )
  }

  isValidPattern(cleanRule: CleanRule, filename: string): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'pattern') &&
      cleanRule.pattern
    ) {
      // normalize filename and remove soft-hyphens
      const normalizedFilename = cleanUpFilename(filename)
      const validationRule = new RegExp(cleanUpFilename(cleanRule.pattern))
      return validationRule.test(normalizedFilename)
    }

    return true
  }

  isFileExtension(cleanRule: CleanRule, filename: string): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'fileExtension') &&
      cleanRule.fileExtension
    ) {
      const fileType = path.extname(filename)
      return cleanRule.fileExtension.includes(fileType)
    }

    return true
  }

  isAppliedToCwd(cleanRule: CleanRule): boolean {
    if (
      Object.prototype.hasOwnProperty.call(cleanRule, 'applyInDir') &&
      cleanRule.applyInDir
    ) {
      return cleanRule.applyInDir.includes(process.cwd())
    }

    return true
  }

  async validateDirectoryAndMoveFiles(
    filename: string,
    config: MaidConfig,
  ): Promise<void> {
    for (const conf of config.cleanRules) {
      if (
        this.isAtLeastOneRulePresent(conf) &&
        this.isAppliedToCwd(conf) &&
        this.isValidPattern(conf, filename) &&
        this.isFileExtension(conf, filename)
      ) {
        this.moveFile(conf.dirName, filename)
      }
    }
  }

  cleanDirectory(config: Config): void {
    const currentDirectory = process.cwd()
    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error('Fehler beim Lesen des Verzeichnisses:', err)
        return
      }

      for (const file of files) {
        const filePath = path.join(currentDirectory, file)
        const isFile = fs.statSync(filePath).isFile()
        if (isFile) {
          this.validateDirectoryAndMoveFiles(file, config.config as MaidConfig)
        }
      }
    })
  }

  async run(): Promise<void> {
    const config: ConfigOrNull = await searchForConfig()
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
            this.cleanDirectory(config)
          } else {
            console.log('Clean aborted.')
          }
        })
        .catch((error: string) => {
          console.log(error)
        })
      } else {
        this.cleanDirectory(config)
      }
    } else {
      console.log(
        chalk.redBright('No configuration found! - No config, no cleaning'),
      )
      console.log(
        'To prevent you from accidentally or unwillingly moving files around,',
      )
      console.log(
        'maid requires instructions from you. Please create a ' +
          chalk.greenBright('.maidrc') +
          ' file',
      )
      console.log('and give maid instructions on how and where to clean.')
      console.log('Further information on the required instructions')
      console.log(
        'can be found at: ' +
          chalk.gray('https://github.com/McMuellermilch/maid-cli'),
      )
    }
  }
}
