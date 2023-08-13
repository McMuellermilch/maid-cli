import { Command } from "@oclif/core";
const fs = require("fs");
const path = require("path");

export class Clean extends Command {
  static description = "Clean current directory";

  moveFile(currentDirectory: string, dirName: string, fileName: string) {
    const currentPath = path.join(currentDirectory, fileName);
    const destinationPath = path.join(currentDirectory, dirName, fileName);

    //check if dir <dirName> exists
    this.initDirectory(currentDirectory, dirName);

    fs.rename(currentPath, destinationPath, function (err: any) {
      if (err) {
        throw err;
      } else {
        console.log("Moved file " + fileName + " to directory " + dirName);
      }
    });
  }

  initDirectory(currentDirectory: string, dirName: string) {
    const dirPath = path.join(currentDirectory, dirName);

    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, { recursive: true }, (err: any) => {
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

  async run(): Promise<void> {
    const currentDirectory = process.cwd(); // Aktuelles Verzeichnis

    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error("Fehler beim Lesen des Verzeichnisses:", err);
        return;
      }

      files.forEach((file: any) => {
        const filePath = path.join(currentDirectory, file);
        const fileType = path.extname(file);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          if (fileType) {
            switch (fileType) {
              case ".pdf":
                this.moveFile(currentDirectory, "pdf", file);
                break;
              case ".png":
                this.moveFile(currentDirectory, "png", file);
                break;
              default:
                break;
            }
          }
        }
      });
    });
  }
}
