import chart from '../../src/chart';
import defaultOps, { optionsMerge } from '../../src/options';
import files from './files';
import expected from './expected';
import expectedNoReq from './expected_no_required';
import expectedNoSuite from './expected_no_suite';

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
