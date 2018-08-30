import requireDir from 'require-directory';
import path from 'path';
import { isObject, mapArray, filterObj } from './utils';

const DEFAULT_FILES = { input: true, expected: true };

const getFileDefs = opts => {
  if (Array.isArray(opts.files)) {
    return mapArray(opts.files, f => true);
  } else if (isObject(opts.files)) {
    return opts.files;
  } else {
    return DEFAULT_FILES;
  }
};

const getBaseDir = filename => path.dirname(filename);

class Spec {
  constructor (caller, options) {
    this.caller = caller;
    this.basedir = getBaseDir(caller.filename);

    this.options = options || {};

    this.fileDefs = getFileDefs(this.options);
    this.requiredFiles = Object.keys(
      filterObj(this.fileDefs, (file, required) => required)
    );
  }

  getFiles = dir => filterObj(dir, file => file in this.fileDefs);

  getDirs = dir => filterObj(dir, file => !(file in this.fileDefs));

  requiredPresent = files => this.requiredFiles.every(req => req in files);

  suiteSpecs = (dirs, files) =>
    Object.keys(dirs)
      .map(d => this.suiteSpec(d, dirs[d], files))
      .filter(s => !!s) || undefined;

  testSpecs = (dirs, files) =>
    Object.keys(dirs)
      .map(d => this.testSpec(d, dirs[d], files))
      .filter(s => !!s);

  suiteSpec = (name, dir, files) => {
    const subs = this.getDirs(dir);
    const suite = {
      name,
      suites: this.suiteSpecs(subs, files),
      tests: this.testSpecs(subs, files)
    };

    if (suite.tests || suite.suites) {
      return suite;
    }
  };

  testSpec = (name, dir, parentFiles) => {
    const dirFiles = this.getFiles(dir);
    const files = { ...parentFiles, ...dirFiles };
    if (this.requiredPresent(files)) {
      return { name, files };
    }
  };

  get = dirname => {
    const dir = requireDir(this.caller, path.join(this.basedir, dirname));
    return {
      suite: this.suiteSpec(dirname, dir),
      test: this.testSpec(dirname, dir)
    };
  };
}

const specs = (caller, dirname, options) =>
  new Spec(caller, options).get(dirname);

export default specs;
