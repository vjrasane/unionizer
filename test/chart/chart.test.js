import chart from '../../src/chart';

import files from './files';
import expected from './expected';
import expectedNoReq from './expected_no_required';
import expectedNoSuite from './expected_no_suite';

describe('chart', () => {
  it('default', () => {
    const spec = chart('name', files, {
      files: {
        input: 'input.json',
        expected: 'expected.json',
        required: []
      }
    });
    expect(spec).toEqual(expected);
  });

  it('no input or output', () => {
    const spec = chart('name', files, {
      files: {
        required: []
      }
    });
    expect(spec).toEqual(expectedNoReq);
  });

  it('no suite', () => {
    const spec = chart('name', files.dir1.contents, {
      files: {
        input: 'input.json',
        expected: 'expected.json',
        required: []
      }
    });
    expect(spec).toEqual(expectedNoSuite);
  });
});
