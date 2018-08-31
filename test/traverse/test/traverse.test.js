import traverse from '../../../src/traverse';

import expectedStruct from '../expected/expected';

describe('traverser', () => {
  it('default', () => {
    const structure = traverse(module, '../structure');
    expect(structure).toEqual(expectedStruct);
  });

  it('subdir', () => {
    const structure = traverse(module, '../structure/dir1');
    expect(structure).toEqual(expectedStruct.dir1.contents);
  });

  it('basedir', () => {
    const structure = traverse(module);
    expect(structure).toEqual({});
  });
});
