import merge from 'deepmerge';

export const optionsMerge = (base, opts) =>
  merge(base, opts, { arrayMerge: (base, next) => next });

export default {
  test: {
    exec: input => input,
    validate: (result, expected) => expect(result).toEqual(expected),
    error: (error, expectedError) =>
      expect(error.message).toEqual(expectedError),
    skipSuffix: '.skip',
    onlySuffix: '.only'
  },
  files: {
    input: 'input.json',
    expected: 'expected.json',
    expectedError: 'expected_error.json',
    required: ['input.json']
  }
};
