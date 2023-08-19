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
npm install maid-cleaning-cli -g
```

## Usage

### Listing contents of directory

To list all files and sub-directories in a certain directory, just navigate to said directory and tell maid to list:

```
maid list
```

The output will be color-coded. Blue will be all the files in the directory and red will be the names of sub-directories.

<p align="center">
  <img src="resources/maid_resource-screenshot_maid-list.png" alt="logo">
</p>

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

### Example

With the following rule in my maidrc

```yaml
---
cleanRules:
  - { pattern: "^Test", fileExtension: ".txt", dirName: "test_txt_files" }
```

Every file with a name starting with `"Test"` and a file extention of `".txt"` will be moved to a folder `test_txt_files`.

<p align="center">
  <img src="resources/maid_resource-screenshot-list-and-clean.png" alt="logo">
</p>

### .maidrc

To instruct maid on what should be cleaned, create a `.maidrc`-file on your machine and maid will look for it when running.

The config file is far from finished. For now, you can specify one property in it: `cleanRules`

`cleanRules` is an array of objects, which contains all the rules for maid on where and what to clean. Each object in this list will represent one rule. A rule indicates what to clean. Restrictions can be added to specify in which cases (specific filenames, specific file-extensions, specific folders only, ...) maid will go ahead and actually clean. The following fields can be defined as of now:

- `pattern (String)`: A regular expression to describe how the filename should look (e.g. `"^Test"` will filter all files starting with "Test")
- `fileExtension (String-Array)`: A list of file extension to limit the files to be cleaned (e.g. `".png"` - include the `.`)
- `applyInDir (String-Array)`: A list of paths in which the rule can be applied. If applyInDir is no present, the rule is global and applicable in every folder
- `dirName (String)`: When cleaning files, maid will move them to a folder, that can be specified with this string (e.g. `"/screenshots/images"`)

`pattern`, `fileExtension` and `applyInDir` will be evaluated with `AND`-logic, so the rule

```json
{
  "pattern": "^Testfile",
  "fileExtension": [".png"],
  "dirName": "testfiles",
  "applyInDir": ["/Users/<username>/Desktop"]
}
```

will only move files to a folder called `testfiles`, if the following conditions are all met:

- if the filename starts with `"Testfile"`
- if the file has the extension `.png`
- the current directory is `/Users/<username>/Desktop`

If neither `pattern` nor `fileExtension` is defined, the rule will not trigger and do nothing.

### git repo safeguard

As an additional safeguard to prevent accidentally messing up the structure of git repositories, maid has a build in check when running `clean`. If current directory is a git repository, maid will ask if you wish to continue.

<p align="center">
  <img src="resources/maid_resource-screenshot_git-safeguard.png" alt="logo">
</p>

###

### Finding existing config

To find if and where the `.maidrc` file might be, just ask maid for `config` and add the flag `-p` or `--path`:

```
maid config -p
```
