import { Command } from "@oclif/core";
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

export class List extends Command {
  static description = "Clean current directory";

  async run(): Promise<void> {
    const currentDirectory = process.cwd(); // Aktuelles Verzeichnis

    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error("Error while reading directory:", err);
        return;
      }

      console.log(chalk.blue("Files in current directory"));
      files.forEach((file: any) => {
        const filePath = path.join(currentDirectory, file);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          console.log(file);
        }
      });
    });
  }
}
