import { defaultOps } from '../../src/main';

import generate from '../../src/generate';
import spec from './spec';
import errorSpec from './error_spec';

generate(spec, defaultOps);

// error
generate(errorSpec, {
  ...defaultOps,
  test: {
    ...defaultOps.test,
    exec: () => {
      throw Error('error');
    }
  }
});

generate(spec, {
  ...defaultOps,
  test: {
    override: (files) => {
      expect('input.json' in files).toBeTruthy();
      expect('expected.json' in files).toBeTruthy();
    }
  }
});
