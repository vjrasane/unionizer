import specs from './specs';

class Generator {
  constructor (caller, func, options) {
    this.caller = caller;

    this.options = options || {};
    this.func = func;
  }

  wrapper = (name, it) =>
    name.endsWith('#skip') ? it.skip : name.endsWith('#only') ? it.only : it;

  createSuite = spec => {
    this.wrapper(spec.name, describe)(spec.name, () => {
      spec.tests.forEach(t => this.createTest(t));
      spec.suites.forEach(s => this.createSuite(s));
    });
  };

  createTest = spec => {
    this.wrapper(spec.name, it)(spec.name, () => {
      const files = spec.files ? spec.files : {};
      if (this.options.override) {
        this.func(files);
      } else {
        try {
          const result = this.func(files);
          expect(result).toEqual(files.expected);
        } catch (error) {
          if (files.expected_error) {
            expect(error.message).toEqual(files.expected_error);
          } else {
            throw error;
          }
        }
      }
    });
  };

  generate = dirname => {
    const spec = specs(this.caller, dirname, this.options);
    if (spec.test) {
      this.createTest(spec.test);
    }
    if (spec.suite) {
      this.createSuite(spec.suite);
    }
  };
}

const generate = (caller, dirname, func, options) => {
  new Generator(caller, func, options).generate(dirname);
}
  
export default generate;
