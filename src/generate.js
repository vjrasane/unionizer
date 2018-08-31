class Generator {
  constructor (options) {
    this.options = options;
  }

  wrapper = (name, it) =>
    name.endsWith('#skip') ? it.skip : name.endsWith('#only') ? it.only : it;

  defaultTest = files => {
    try {
      const result = this.options.test.exec(
        files[this.options.files.input],
        files
      );
      this.options.test.validate(
        result,
        files[this.options.files.expected],
        files
      );
    } catch (error) {
      const expected = files[this.options.files.expectedError];
      if (expected) {
        this.options.test.error(error, expected, files);
      } else {
        throw error;
      }
    }
  };

  createSuite = spec => {
    this.wrapper(spec.name, describe)(spec.name, () => {
      spec.tests.forEach(t => this.createTest(t));
      spec.suites.forEach(s => this.createSuite(s));
    });
  };

  createTest = spec => {
    this.wrapper(spec.name, it)(spec.name, () => {
      const files = spec.files ? spec.files : {};
      if (this.options.test.override) {
        this.options.test.override(files);
      } else {
        this.defaultTest(files);
      }
    });
  };

  generate = spec => {
    if (spec.test) {
      this.createTest(spec.test);
    }
    if (spec.suite) {
      this.createSuite(spec.suite);
    }
  };
}

const generate = (spec, options) => {
  new Generator(options).generate(spec);
};

export default generate;
