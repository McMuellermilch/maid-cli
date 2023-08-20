import {Command, Flags} from '@oclif/core'
import {searchForConfig} from '../../utils/conf-explorer'
import chalk = require('chalk');
import {Answers} from 'inquirer'
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

interface CleanRule {
  pattern?: string;
  dirName: string;
  applyInDir?: string[];
  fileExtension?: string[];
}

export class Configuration extends Command {
  static description = 'Find and edit your config';

  private defaultContent = {
    cleanRules: [],
  };

  static flags = {
    path: Flags.boolean({
      char: 'p',
      description: 'Show path to file',
      required: false,
    }),
    cleanRules: Flags.boolean({
      char: 'r',
      description: 'Show all cleanRules',
      required: false,
    }),
    rulesForDir: Flags.boolean({
      char: 'd',
      description: 'Show all cleanRules for current directory',
      required: false,
    }),
    init: Flags.boolean({
      char: 'i',
      description: 'Create new .maidrc file',
      required: false,
    }),
    addRule: Flags.boolean({
      char: 'a',
      description: 'Add rule to cleanRules',
      required: false,
    }),
  };

  getRulesForCurrentDir(config: CleanRule[]): CleanRule[] {
    const currentDir = process.cwd()

    return config.filter(rule => {
      if (
        Object.prototype.hasOwnProperty.call(rule, 'applyInDir') &&
        rule.applyInDir
      ) {
        return rule.applyInDir.includes(currentDir) ? rule : false
      }

      return rule
    })
  }

  async createConfigFile(): Promise<void> {
    const config = await searchForConfig()
    const homedir = require('os').homedir()
    if (config) {
      console.log(
        'Configuration already exists! -> ' + chalk.green(config.filepath),
      )
    } else {
      inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'continue',
          message:
              'No configuration present, would you like to create a .maidrc file?',
        },
      ])
      .then((answers: Answers) => {
        if (answers.continue) {
          const rcFilePath = path.join(homedir, '.maidrc')
          fs.writeFile(
            rcFilePath,
            JSON.stringify(this.defaultContent, null, 2), // Convert to JSON and format
            (err: NodeJS.ErrnoException | null) => {
              if (err) {
                console.error(
                  chalk.redBright('Error creating configuration file:', err),
                )
              } else {
                console.log(
                  chalk.greenBright(
                    'Configuration file successfully created: ',
                    chalk.green(rcFilePath),
                  ),
                )
              }
            },
          )
        } else {
          console.log('Init aborted.')
        }
      })
      .catch((error: string) => {
        console.log(error)
      })
    }
  }

  async addRule(ruleObject: CleanRule): Promise<void> {
    const {filepath} = await await searchForConfig()

    try {
      const configContent = fs.readFileSync(filepath, 'utf8')
      const config = JSON.parse(configContent)

      if (!config.cleanRules) {
        config.cleanRules = [] // Initialize cleanRules if it doesn't exist
      }

      config.cleanRules.push(ruleObject)

      fs.writeFileSync(filepath, JSON.stringify(config, null, 2))
      console.log('Rule added to .maidrc:', ruleObject)
    } catch (error) {
      console.error('Error adding rule to .maidrc:', error)
    }
  }

  async promptForRule(): Promise<any> {
    const patternQuestion = {
      type: 'input',
      name: 'pattern',
      message: 'Pattern (optional):',
    }

    const fileExtensionQuestion = {
      type: 'input',
      name: 'fileExtension',
      message:
        'File Extension (optional, separate multiple values with comma):',
      filter: (input: string) =>
        input ? input.split(',').map(ext => ext.trim()) : null,
    }

    const applyInDirQuestion = {
      type: 'input',
      name: 'applyInDir',
      message:
        'Apply Rule only in following dirs (optional, separate multiple values with comma):',
      filter: (input: string) =>
        input ? input.split(',').map(path => path.trim()) : null,
    }

    const dirNameQuestion = {
      type: 'input',
      name: 'dirName',
      message: 'Directory Name (required):',
      validate: (input: string) =>
        Boolean(input.trim()) || 'Directory Name is required',
    }

    const answers = await inquirer.prompt([
      fileExtensionQuestion,
      patternQuestion,
      dirNameQuestion,
      applyInDirQuestion,
    ])

    if (!answers.pattern && answers.fileExtension.length === 0) {
      console.error(
        chalk.redBright('Either Pattern or File Extension is required'),
      )
      return
    }

    return Object.fromEntries(
      Object.entries(answers).filter(([_, v]) => v !== null),
    )
  }

  async run(): Promise<void> {
    const config = await searchForConfig()
    const {flags} = await this.parse(Configuration)

    if (flags.init) {
      await this.createConfigFile()
      return
    }

    if (!config) {
      console.log('No config found!')
      return
    }

    if (flags.addRule) {
      try {
        const rule = await this.promptForRule()
        if (rule) {
          await this.addRule(rule)
        }
      } catch {
        console.log('error while adding rule')
      }

      return
    }

    if (flags.path) {
      console.log(chalk.greenBright('Config for maid can be found here:'))
      console.log(config.filepath)
      return
    }

    if (flags.cleanRules) {
      if (config.config && config.config.cleanRules) {
        console.log(chalk.greenBright('All rules for cleaning:'))
        console.log(config.config.cleanRules)
      } else {
        console.log('No cleanRules found!')
      }

      return
    }

    if (flags.rulesForDir) {
      if (config.config && config.config.cleanRules) {
        console.log(
          chalk.greenBright('Rules applicable in current directory:'),
        )
        console.log(this.getRulesForCurrentDir(config.config.cleanRules))
      } else {
        console.log('No cleanRules found!')
      }

      return
    }

    console.log(config)
  }
}
