<p align="center">
  <img src="resources/maid_icon.png" alt="logo" width="100" height="100">
</p>

# maid-cleaning-cli

### Maid keeps the house clean.

Directories can get pretty messy. Maid is here to help. Define where which files should go and maid will take care of it.

Wouldn't it be nice to just type the word `clean` and have the current directory nice and tidy again? Or just type `list` and see the mess that grew on your Desktop over time?

Maid is your lightweight CLI utility sidekick to help with exactly that.

## Installation

```
npm install maid -g
```

## Usage

### Listing contents of directory

To list all files und sub-directories in a certain direcotry, just navigate to said directory and tell maid to list:

```
maid list
```

The output will be color-coded. Blue will be all the files in the directory and red will be the names of sub-directories.

To specify what to list, `list` accepts two flags:

- `-f` or `--files` to show files
- `-d` or `--dirs` to show directories

When using the flags, a color-coded headline will be printed above the actual result. Either `Directories in current directory` or `Files in current directory`.

### Cleaning a directory

To clean a directory, just simply navigate to the messy directory and tell maid to clean:

```
maid clean
```

By default maid will not start cleaining without you instructing what needs cleaing and what must not be cleaned. For the clean command to take action, a `.maidrc`-file is required. If no config is present, an error with instructions will be printed - so don't worry, maid won't go ahead and move your files around without you knowing what you are doing.

### .maidrc

To instruct maid on what should be cleaned, create a `.maidrc`-file on your machine and maid will look for it when running.

The config file is far from finished. For now, you can specify one property in it: `cleanRules`

`cleanRules` is an array of objects, which contains all the rule for maid on where and what to clean. Each object in this list will represent one rule. A rule indicates what to clean. Restrictions can be added to specify in which cases (specific filenames, specific file-extensions, specific folders only, ...) maid will go ahead and actually clean. The following fields can be defined as of now:

- `pattern (String)`: A regular expression to describe how the filename should look (e.g. `"^Test"` will filter all files starting with "Test")
- `fileExtension (String-Array)`: A list of file extension to limit the files to be cleaned (e.g. `".png"` - include the `.`)
- `applyInDir (String-Array)`: A list of paths in which the rule can be applied. If applyInDir is no present, the rule is global and applicable in every folder
- `dirName (String)`: When cleaning files, maid will move them to a folder, that can be specified with this string (e.g. `"/screenshots/images"`)

`pattern`, `fileExtension` and `applyInDir` will be evaluated with `AND`-logic, so the rule

`{ pattern: "^Testfile", fileExtension: [".png"], dirName: "testfiles", applyInDir: ['/Users/<username>/Desktop'] }`

will only move files to a folder called `testfiles`, if the following conditions are all met:

- if the filename starts with `"Testfile"`
- if the file has the extension `.png`
- the current directory is `/Users/<username>/Desktop`
