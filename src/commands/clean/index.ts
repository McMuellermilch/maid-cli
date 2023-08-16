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

  validateDirectoryAndMoveFiles(filename: string, config: any) {
    const currentDirectory = process.cwd();
    //normalize filename and remove soft-hyphens
    const normalizedFilename = cleanUpFilename(filename);
    config.cleanRules.forEach(
      async (config: { pattern: string; dirName: string }) => {
        const validationRule = new RegExp(cleanUpFilename(config.pattern));
        if (validationRule.test(normalizedFilename)) {
          await this.moveFile(currentDirectory, config.dirName, filename);
        }
      }
    );
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
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          this.validateDirectoryAndMoveFiles(file, config.config);
          //TODO: implement fallback for cleanup-strategy if no config present
        }
      });
    });
  }
}
