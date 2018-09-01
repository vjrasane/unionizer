# unionizer

Generates Jest unit tests from input-output file pairs in given file structure.

[![License][ASL-2.0 badge]][ASL-2.0] [![Build Status][Travis badge]][Travis] [![Coverage Status][Coverage badge]][Coveralls] [![npm version][npm badge]][npm]

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  * [Generating testcases](#generating-testcases)
  * [Test hierarchy](#test-hierarchy)
  * [Expecting errors](#expecting-errors)
  * [Filtering tests](#filtering-tests)
- [Options](#options)
  * [Test options](#test-options)
  * [File options](#file-options)
 

## Installation ([npm](https://www.npmjs.com/package/unionizer))

#### NPM
```bash
$ npm install unionizer --save-dev
```
#### Yarn
```bash
$ yarn add unionizer --dev
```

## Usage

### Generating testcases

The most basic usage of unionizer is to create a testcase directory that contains an input and output JSON file:
```
* testcase
  * input.json
  * expected.json
```
Then in the same directory, create a Jest test suite (Jest has to be installed and configured):

```javascript
import unionize from 'unionizer';

unionize(module, 'testcase', {
  test: {
    exec: myTestFunction
  }
});
```

Where **myTestFunction** corresponds to whichever function you're testing. Unionizer passes the found **input.json** file contents as the first argument to the test function and an object containing all found files as the second argument.

The return value of the test function is validated against the found **expected.json** and the generated test passes if they match. The names of the input and output files can be defined in [file options](#file-options).

Note that the first argument of **unionize** has to be the calling module, which it uses to determine the location of the testcase files.

You can also specify a testcase directory not in the same location as the test itself:

```javascript
unionize(module, '../other/directory/testcase', {
  test: {
    exec: myTestFunction
  }
});
```


### Test hierarchy

Unionizer iterates recursively over all directories and files in the given file structure. It generates a test for each directory that contains the required files (by default only **input.json**) and a suite for each directory that contains at least one suite or test. The required files can be defined in [file options](#file-options).

For example:
```
* testcases
  * suite
    * first_test
      * input.json
      * expected.json
    * second_test
      * input.json
      * expected.json
  * test
    * input.json
    * expected.json
```
Would generate one **testcases** suite containing **test** and **suite**, which would contain two tests.

The files found in directories are passed on to contained suites and tests, so you can create common files for multiple tests. Tests can also overwrite the files passed from their parent.

For example:
```
* testcases
  * expected.json
  * first_test
    * input.json
  * second_test
    * input.json
  * third_test
    * input.json
    * expected.json
```
Would create three tests, where the two first tests would use the common **expected.json** from their parent directory, but the third test would overwrite it with its own.

Tests inherit *all* JSON files in the file structure in this way, not just the default input and output files. Naturally, the files need to be valid JSON. This includes objects, arrays, numbers and strings.

If the output of your tested function is not valid JSON, you'll have to parse the contents of **expected.json** in a custom validator, which is covered in the [test options](#test-options) section.

### Expecting errors

If a testcase is expected to throw an error, an **expected_error.json** file has to be added to the testcase directory:

```
* testcase
  * input.json
  * expected_error.json
```
The file should contain the error message of the thrown error. This behavior can be overridden by providing a custom error handler as explained in the [test options](#test-options) section.

### Filtering tests

Tests can be filtered with Jest's pattern matching:

```bash
jest -t <my-test-pattern>
```

Each generated testcase is checked against the given pattern and run only if it matches.

Another option is to add a 'skip' or 'only' suffix to the testcase directory name:

```
* testcases
  * suite.only
    * test
      * input.json
      * expected.json
  * test.skip
    * input.json
    * expected.json
```

This will skip the marked tests or filter out any tests that are not marked with 'only'. The matched suffixes can be defined in [test options](#test-options).

## Options

Unionizer's behavior can be customized with the third options argument of the 'unionize' function.

### Test options

The test options expose the function executed in each testcase, the validator of the output and the error handler. All of these have a simple default implementation, so in most cases only the executed function needs to be provided.

```javascript
unionize(module, 'testcase', {
  test: {
    /* executed function */
    exec: myTestFunction, 
    /* output validator */
    validate: myOutputValidator, 
    /* error handler */
    error: myErrorHandler
  }
});
```

The executed function receives the input file contents as first argument, if present and an object containing all found files as the second argument:

```javascript
exec(input, files);
```

The validator receives the result of the executed method, the expected output file contents if present, and the same object with all files.

```javascript
validate(result, expected, files);
```

The error handler receives the error, expected error message if present and the same file object.

```javascript
error(error, expected_error, files);
```

Alternatively, the entire test functionality can be overridden:

```javascript
unionize(module, 'testcase', {
  test: {
    /* test override */
    override: myTestOverride
  }
});
```
If an override is provided, the test function, validator and error handler are ignored. The override function receives only the object containing all found files:
```javascript
override(files);
```

Lastly, the 'skip' and 'only' suffixes can be defined in the test options:

```javascript
unionize(module, 'testcase', {
  test: {
    /* skip suffix of tests and suites */
    skipSuffix: '.my-skip-suffix',
    /* only suffix of tests and suites */
    onlySuffix: '.my-only-suffix'
  }
});
```

### File options

File options can be used to define names for the input and output files as well as set the required files for each testcase.

```javascript
unionize(module, 'testcase', {
  files: {
    /* input file name */
    input: 'my-input.json',
    /* expected output file name */
    expected: 'my-expected.json',
    /* expected error file name */
    expectedError: 'my-expected-error.json',
    /* list of required files */
    required: ['my-input.json', 'my-other-data-file.json']
  }
});
```
Note that the required files array overwrites the default array, rather than merges it, so every required file must be included.

Tests are only generated if each required file is present, either by inheritance from a parent directory or in the test directory itself.

[Coverage badge]: https://coveralls.io/repos/github/vjrasane/unionizer/badge.svg?service=github
[Coveralls]: https://coveralls.io/github/vjrasane/unionizer
[ASL-2.0 badge]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[ASL-2.0]: https://opensource.org/licenses/Apache-2.0
[Travis badge]: https://travis-ci.org/vjrasane/unionizer.svg?branch=master&service=github
[Travis]: https://travis-ci.org/vjrasane/unionizer
[npm badge]: https://badge.fury.io/js/unionizer.svg?service=github
[npm]: https://badge.fury.io/js/unionizer