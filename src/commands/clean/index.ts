import { Command } from "@oclif/core";
import { searchForConfig } from "../../utils/confExplorer";
import chalk = require("chalk");
import { cleanUpFilename } from "../../utils/util";
const fs = require("fs");
const path = require("path");

export class Clean extends Command {
  static description = "Clean current directory";

  async moveFile(currentDirectory: string, dirName: string, fileName: string) {
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
        await fs.mkdir(dirPath, { recursive: true }, (err: any) => {
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

  validateForDirectory(filename: string, config: any) {
    //normalize filename and remove soft-hyphens
    const normalizedFilename = cleanUpFilename(filename);
    const validationRule = new RegExp(
      cleanUpFilename(config.cleanRules[0].pattern)
    );
    const isMatch = validationRule.test(normalizedFilename);
    return isMatch;
  }

  async run(): Promise<void> {
    const currentDirectory = process.cwd();
    const config = await searchForConfig();
    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error("Fehler beim Lesen des Verzeichnisses:", err);
        return;
      }

      files.forEach(async (file: any) => {
        const filePath = path.join(currentDirectory, file);
        const fileType = path.extname(file);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          //TODO: iterate over config array and validate
          if (this.validateForDirectory(file, config.config)) {
            await this.moveFile(
              currentDirectory,
              config.config.cleanRules[0].dirName,
              file
            );
          }
          //TODO: implement fallback for cleanup-strategy if no config present
        }
      });
    });
  }
}
