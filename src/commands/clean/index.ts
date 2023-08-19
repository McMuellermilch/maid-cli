import { Command } from "@oclif/core";
import { searchForConfig } from "../../utils/confExplorer";
import chalk = require("chalk");
import { cleanUpFilename } from "../../utils/util";
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
import { Answers } from "inquirer";

export class Clean extends Command {
  static description = "Clean current directory";

  async moveFile(dirName: string, fileName: string) {
    const currentDirectory = process.cwd();
    const currentPath = path.join(currentDirectory, fileName);
    const destinationPath = path.join(currentDirectory, dirName, fileName);

    await this.initDirectory(currentDirectory, dirName);

    fs.rename(currentPath, destinationPath, function (err: any) {
      if (err) {
        throw err;
      } else {
        console.log("Moved file " + fileName + " to directory " + dirName);
      }
    });
  }

  async initDirectory(currentDirectory: string, dirName: string) {
    const dirPath = path.join(currentDirectory, dirName);

    try {
      if (!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, { recursive: true }, (err: any) => {
          if (err) {
            return console.error(err);
          }
          console.log("Directory created successfully!");
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  isGitRepo() {
    return fs.existsSync(path.join(process.cwd(), ".git"));
  }

  isAtLeastOneRulePresent({ pattern, fileExtension }: CleanRule) {
    return (
      (pattern && pattern !== "") || (fileExtension && fileExtension.length > 0)
    );
  }

  isValidPattern(cleanRule: CleanRule, filename: string): boolean {
    if (cleanRule.hasOwnProperty("pattern") && cleanRule.pattern) {
      //normalize filename and remove soft-hyphens
      const normalizedFilename = cleanUpFilename(filename);
      const validationRule = new RegExp(cleanUpFilename(cleanRule.pattern));
      return validationRule.test(normalizedFilename);
    } else {
      return true;
    }
  }

  isFileExtension(cleanRule: CleanRule, filename: string): boolean {
    if (cleanRule.hasOwnProperty("fileExtension") && cleanRule.fileExtension) {
      const fileType = path.extname(filename);
      return cleanRule.fileExtension.includes(fileType);
    } else {
      return true;
    }
  }

  isAppliedToCwd(cleanRule: CleanRule): boolean {
    if (cleanRule.hasOwnProperty("applyInDir") && cleanRule.applyInDir) {
      return cleanRule.applyInDir.includes(process.cwd());
    } else {
      return true;
    }
  }

  validateDirectoryAndMoveFiles(filename: string, config: any) {
    config.cleanRules.forEach(async (config: CleanRule) => {
      if (
        this.isAtLeastOneRulePresent(config) &&
        this.isAppliedToCwd(config) &&
        this.isValidPattern(config, filename) &&
        this.isFileExtension(config, filename)
      ) {
        await this.moveFile(config.dirName, filename);
      }
    });
  }

  cleanDirectory(config: Config) {
    const currentDirectory = process.cwd();
    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error("Fehler beim Lesen des Verzeichnisses:", err);
        return;
      }
      files.forEach(async (file: any) => {
        const filePath = path.join(currentDirectory, file);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          this.validateDirectoryAndMoveFiles(file, config.config);
        }
      });
    });
  }

  async run(): Promise<void> {
    const config: ConfigOrNull = await searchForConfig();
    if (config && config.config) {
      if (this.isGitRepo()) {
        inquirer
          .prompt([
            {
              type: "confirm",
              name: "continue",
              message:
                "Current directory appears to be a git repo - are you sure you want to continue?",
            },
          ])
          .then((answers: Answers) => {
            if (answers.continue) {
              this.cleanDirectory(config);
            } else {
              console.log("Clean aborted.");
              return;
            }
          })
          .catch((error: string) => {
            console.log(error);
          });
      } else {
        this.cleanDirectory(config);
      }
    } else {
      console.log(
        chalk.redBright("No configuration found! - No config, no cleaning")
      );
      console.log(
        "To prevent you from accidentally or unwillingly moving files around,"
      );
      console.log(
        "maid requires instructions from you. Please create a " +
          chalk.greenBright(".maidrc") +
          " file"
      );
      console.log("and give maid instructions on how and where to clean.");
      console.log("Further information on the required instructions");
      console.log(
        "can be found at: " +
          chalk.gray("https://github.com/McMuellermilch/maid-cli")
      );
    }
  }
}
