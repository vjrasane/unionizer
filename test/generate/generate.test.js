import defaultOps, { optionsMerge } from '../../src/options';
import generate from '../../src/generate';
import spec from './spec';
import errorSpec from './error_spec';
import skipAndOnlySpec from './skip_and_only_spec';

describe('generate', () => {
  let mockTest;
  let mockSuite;

  let mockOpts;

  beforeEach(() => {
    mockTest = jest.fn((name, func) => func());
    mockSuite = jest.fn((name, func) => func());

    mockOpts = optionsMerge(defaultOps, {
      test: {
        mocks: {
          test: mockTest,
          suite: mockSuite
        }
      }
    });
  });

  it('default', () => {
    generate(spec, mockOpts);
    expect(mockSuite.mock.calls.length).toBe(3);
    expect(mockTest.mock.calls.length).toBe(3);

    expect(mockSuite.mock.calls[0][0]).toBe('name');
    expect(mockSuite.mock.calls[1][0]).toBe('dir2');
    expect(mockSuite.mock.calls[2][0]).toBe('subdir2');

    expect(mockTest.mock.calls[0][0]).toBe('dir1');
    expect(mockTest.mock.calls[1][0]).toBe('subdir1');
    expect(mockTest.mock.calls[2][0]).toBe('subsubdir');
  });

  it('expected error', () => {
    generate(
      errorSpec,
      optionsMerge(mockOpts, {
        test: {
          exec: () => {
            throw Error('error');
          }
        }
      })
    );
  });

  it('unexpected error', () => {
    try {
      generate(
        spec,
        optionsMerge(mockOpts, {
          test: {
            exec: () => {
              throw Error('error');
            }
          }
        })
      );
    } catch (error) {
      expect(error.message).toBe('error');
    }
  });

  it('skip and only', () => {
    const suiteSkip = jest.fn((name, func) => func());
    const suiteOnly = jest.fn((name, func) => func());
    suiteOnly.skip = suiteSkip;
    suiteSkip.only = suiteOnly;
    mockSuite.skip = suiteSkip;
    mockSuite.only = suiteOnly;

    const testSkip = jest.fn((name, func) => func());
    const testOnly = jest.fn((name, func) => func());
    testOnly.skip = testSkip;
    testSkip.only = testOnly;
    mockTest.skip = testSkip;
    mockTest.only = testOnly;

    generate(skipAndOnlySpec, mockOpts);

    expect(suiteOnly.mock.calls.length).toBe(1);
    expect(suiteOnly.mock.calls[0][0]).toBe('name');

    expect(suiteSkip.mock.calls.length).toBe(1);
    expect(suiteSkip.mock.calls[0][0]).toBe('dir2');

    expect(testOnly.mock.calls.length).toBe(1);
    expect(testOnly.mock.calls[0][0]).toBe('subdir1');

    expect(testSkip.mock.calls.length).toBe(1);
    expect(testSkip.mock.calls[0][0]).toBe('subsubdir');
  });

  it('override test', () => {
    const override = jest.fn();
    generate(
      spec,
      optionsMerge(mockOpts, {
        test: {
          override
        }
      })
    );
    expect(mockSuite.mock.calls.length).toBe(3);
    expect(mockTest.mock.calls.length).toBe(3);
    expect(override.mock.calls.length).toBe(3);

    expect(mockSuite.mock.calls[0][0]).toBe('name');
    expect(mockSuite.mock.calls[1][0]).toBe('dir2');
    expect(mockSuite.mock.calls[2][0]).toBe('subdir2');

    expect(mockTest.mock.calls[0][0]).toBe('dir1');
    expect(mockTest.mock.calls[1][0]).toBe('subdir1');
    expect(mockTest.mock.calls[2][0]).toBe('subsubdir');

    expect(override.mock.calls[0][0]).toEqual({
      'expected.json': 'test3',
      'input.json': 'test3'
    });
    expect(override.mock.calls[1][0]).toEqual({
      'expected.json': 'test2',
      'input.json': 'test2'
    });
    expect(override.mock.calls[2][0]).toEqual({
      'expected.json': 'test1',
      'input.json': 'test1'
    });
  });
});
