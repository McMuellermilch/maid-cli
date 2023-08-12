import { Command } from "@oclif/core";
const fs = require("fs");
const path = require("path");

export class Clean extends Command {
  static description = "Clean current directory";

  async run(): Promise<void> {
    const currentDirectory = process.cwd(); // Aktuelles Verzeichnis

    fs.readdir(currentDirectory, (err: any, files: any[]) => {
      if (err) {
        console.error("Fehler beim Lesen des Verzeichnisses:", err);
        return;
      }

      console.log("Dateien im aktuellen Verzeichnis:");
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
