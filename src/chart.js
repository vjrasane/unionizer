import { filterObj, mapObj } from './utils';
import { DOC_TYPE, DIR_TYPE } from './traverse';

class Spec {
  constructor (options) {
    this.options = options;

    this.requiredFiles = [...this.options.files.required];
    if (this.options.files.input) {
      this.requiredFiles.push(this.options.files.input);
    }
    if (this.options.files.expected) {
      this.requiredFiles.push(this.options.files.expected);
    }
  }

  requiredPresent = files => this.requiredFiles.every(req => req in files);

  suiteSpecs = (dirs, files) =>
    Object.keys(dirs)
      .map(d => this.suiteSpec(d, dirs[d].contents, files))
      .filter(s => !!s);

  testSpecs = (dirs, files) =>
    Object.keys(dirs)
      .map(d => this.testSpec(d, dirs[d].contents, files))
      .filter(s => !!s);

  suiteSpec = (name, dir, parentFiles) => {
    const dirs = filterObj(dir, (name, file) => file.type === DIR_TYPE);
    const docs = filterObj(dir, (name, file) => file.type === DOC_TYPE);
    const files = { ...parentFiles, ...docs };

    const suite = {
      name,
      suites: this.suiteSpecs(dirs, files),
      tests: this.testSpecs(dirs, files)
    };

    if (suite.tests.length || suite.suites.length) {
      return suite;
    }
  };

  testSpec = (name, dir, parentFiles) => {
    const docs = filterObj(dir, (name, file) => file.type === DOC_TYPE);
    const files = { ...parentFiles, ...docs };

    if (this.requiredPresent(files)) {
      return { name, files: mapObj(files, (name, file) => file.contents) };
    }
  };

  chart = (name, files) => {
    const chart = {};
    const suite = this.suiteSpec(name, files);
    const test = this.testSpec(name, files);
    if (suite) {
      chart.suite = suite;
    }
    if (test) {
      chart.test = test;
    }
    return chart;
  };
}

const chart = (name, files, options) => new Spec(options).chart(name, files);

export default chart;
