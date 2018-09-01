import chart from './chart';
import traverse from './traverse';
import generate from './generate';
import defaultOps, { optionsMerge } from './options';
import { join, dirname } from 'path';

const unionize = (caller, name, options) => {
  const effectiveOps = optionsMerge(defaultOps, options);
  const files = traverse(caller, join(dirname(caller.filename), name));
  const spec = chart(name, files, effectiveOps);
  return generate(spec, effectiveOps);
};

export default unionize;
