import { Command, Flags } from "@oclif/core";
import { searchForConfig } from "../../utils/confExplorer";
const fs = require("fs");
const path = require("path");

export class Config extends Command {
  static description = "Find and edit your config";

  static flags = {
    path: Flags.boolean({
      char: "p",
      description: "Show path to file",
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Config);

    if (flags.path) {
      const config = await searchForConfig();
      if (config) {
        console.log(config.filepath);
      } else {
        console.log("No config found!");
      }
    }
  }
}
