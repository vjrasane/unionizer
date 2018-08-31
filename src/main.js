import chart from './chart';
import traverse from './traverse';
import generate from './generate';
import { join, dirname } from 'path';

const DEFAULT_FILES = {
  input: 'input.json',
  expected: 'expected.json',
  expectedError: 'expected_error.json',
  required: []
};

const DEFAULT_EXEC = input => input;
const DEFAULT_VALIDATE = (result, expected) => expect(result).toEqual(expected);
const DEFAULT_ERROR = (error, expectedError) =>
  expect(error.message).toEqual(expectedError);

const opts = o => {
  const options = o || {};
  const test = {
    exec: DEFAULT_EXEC,
    validate: DEFAULT_VALIDATE,
    error: DEFAULT_ERROR,
    ...options.test
  };
  const files = { ...DEFAULT_FILES, ...options.files };
  return { files, test };
};

const unionize = (caller, name, options) => {
  const ops = opts(options);
  const files = traverse(caller, join(dirname(caller.filename), name));
  const spec = chart(name, files, ops);
  return generate(spec, ops);
};

export const defaultOps = opts();

export default unionize;
