import { Command, Flags } from "@oclif/core";
import { searchForConfig } from "../../utils/confExplorer";
import chalk = require("chalk");
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
    cleanRules: Flags.boolean({
      char: "r",
      description: "Show all cleanRules",
      required: false,
    }),
    rulesForDir: Flags.boolean({
      char: "d",
      description: "Show all cleanRules for current directory",
      required: false,
    }),
  };

  getRulesForCurrentDir(config: CleanRule[]) {
    const currentDir = process.cwd();

    return config.filter((rule) => {
      if (rule.hasOwnProperty("applyInDir") && rule.applyInDir) {
        if (rule.applyInDir.includes(currentDir)) {
          return rule;
        }
      } else {
        return rule;
      }
    });
  }

  async run(): Promise<void> {
    const config = await searchForConfig();
    const { flags } = await this.parse(Config);

    if (!config) {
      console.log("No config found!");
      return;
    }

    if (flags.path) {
      console.log(chalk.greenBright("Config for maid can be found here:"));
      console.log(config.filepath);
      return;
    }

    if (flags.cleanRules) {
      if (config.config && config.config.cleanRules) {
        console.log(chalk.greenBright("All rules for cleaning:"));
        console.log(config.config.cleanRules);
      } else {
        console.log("No cleanRules found!");
      }
      return;
    }

    if (flags.rulesForDir) {
      if (config.config && config.config.cleanRules) {
        console.log(
          chalk.greenBright("Rules applicable in current directory:")
        );
        console.log(this.getRulesForCurrentDir(config.config.cleanRules));
      } else {
        console.log("No cleanRules found!");
      }
      return;
    }

    console.log(config);
  }
}
