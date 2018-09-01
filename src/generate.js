class Generator {
  constructor (options) {
    this.options = options;

    this.test = it;
    this.suite = describe;
    // allow mocking test and suite functions in tests
    if (process.env.NODE_ENV !== 'production' && this.options.test.mocks) {
      this.test = this.options.test.mocks.test;
      this.suite = this.options.test.mocks.suite;
    }
  }

  wrapper = (spec, tester) => {
    let wrapped = tester;
    if (spec.skip) {
      wrapped = wrapped.skip;
    }
    if (spec.only) {
      wrapped = wrapped.only;
    }
    return wrapped;
  };

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
    this.wrapper(spec, this.suite)(spec.name, () => {
      spec.tests.forEach(t => this.createTest(t));
      spec.suites.forEach(s => this.createSuite(s));
    });
  };

  createTest = spec => {
    this.wrapper(spec, this.test)(spec.name, () => {
      if (this.options.test.override) {
        this.options.test.override(spec.files);
      } else {
        this.defaultTest(spec.files);
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
