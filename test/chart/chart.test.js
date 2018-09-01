import chart from '../../src/chart';
import defaultOps, { optionsMerge } from '../../src/options';
import files from './files';

import expected from './expected';
import expectedOnlyInput from './expected_only_input';
import expectedNoReq from './expected_no_required';
import expectedNoSuite from './expected_no_suite';
import expectedNothingGiven from './expected_nothing_given';

describe('chart', () => {
  it('default', () => {
    const spec = chart(
      'name',
      files,
      optionsMerge(defaultOps, {
        files: {
          required: ['input.json', 'expected.json']
        }
      })
    );
    expect(spec).toEqual(expected);
  });

  it('only input', () => {
    const spec = chart('name', files, defaultOps);
    expect(spec).toEqual(expectedOnlyInput);
  });

  it('no input or output', () => {
    const spec = chart(
      'name',
      files,
      optionsMerge(defaultOps, {
        files: {
          required: []
        }
      })
    );
    expect(spec).toEqual(expectedNoReq);
  });

  it('nothing given', () => {
    const spec = chart(
      'name',
      files,
      optionsMerge(defaultOps, {
        files: {
          input: null
        }
      })
    );
    expect(spec).toEqual(expectedNothingGiven);
  });

  it('no suite', () => {
    const spec = chart(
      'name',
      files.dir1.contents,
      optionsMerge(defaultOps, {
        files: {
          required: ['input.json', 'expected.json']
        }
      })
    );
    expect(spec).toEqual(expectedNoSuite);
  });
});
