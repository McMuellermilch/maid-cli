interface Config {
  config: {
    config?: CleanRule[];
    filepath?: string;
    isEmpty?: boolean;
  };
}

type ConfigOrNull = Config | null | undefined;

interface CleanRule {
  pattern?: string;
  dirName: string;
  applyInDir?: string[];
  fileExtension?: string[];
}
