import {Command, Flags} from '@oclif/core'
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

export class List extends Command {
  static description = 'List contents of current directory';

  static flags = {
    files: Flags.boolean({
      char: 'f',
      description: 'Show files',
      required: false,
    }),
    dirs: Flags.boolean({
      char: 'd',
      description: 'Show directories',
      required: false,
    }),
  };

  listFiles(currentDirectory: string, files: string[]): void {
    const fileList = files.filter(file =>
      fs.statSync(path.join(currentDirectory, file)).isFile(),
    )
    console.log(chalk.blue('\nFiles in current directory'))
    for (const file of fileList) {
      console.log(file)
    }
  }

  listDirectories(currentDirectory: string, files: string[]): void {
    const dirList = files.filter(file =>
      fs.statSync(path.join(currentDirectory, file)).isDirectory(),
    )

    console.log(chalk.red('\nDirectories in current directory'))
    for (const file of dirList) {
      console.log(file)
    }
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(List)
    const currentDirectory = process.cwd()
    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error('Error while reading directory:', err)
        return
      }

      if (!flags.files && !flags.dirs) {
        for (const file of files) {
          if (fs.statSync(path.join(currentDirectory, file)).isDirectory()) {
            console.log(chalk.red(file))
          } else if (fs.statSync(path.join(currentDirectory, file)).isFile()) {
            console.log(chalk.blue(file))
          } else {
            console.log(file)
          }
        }
      } else {
        if (flags.dirs) {
          this.listDirectories(currentDirectory, files)
        }

        if (flags.files) {
          this.listFiles(currentDirectory, files)
        }
      }
    })
  }
}
