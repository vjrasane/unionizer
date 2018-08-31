import fs from 'fs';
import { join, resolve, dirname } from 'path';

export const DIR_TYPE = 'dir';
export const DOC_TYPE = 'doc';

const extensions = ['js', 'json', 'coffee'];

const extensionMatches = name =>
  new RegExp('\\.(' + extensions.join('|') + ')$', 'i').test(name);

const traverse = (caller, basePath) => {
  const hierarchy = {};

  const path = !basePath
    ? dirname(caller.filename)
    : resolve(dirname(caller.filename), basePath);

  fs.readdirSync(path).forEach(filename => {
    const fullPath = join(path, filename);

    if (fs.statSync(fullPath).isDirectory()) {
      const files = traverse(caller, fullPath);
      if (Object.keys(files).length) {
        hierarchy[filename] = {
          type: DIR_TYPE,
          contents: files
        };
      }
    } else if (fullPath !== caller.filename && extensionMatches(filename)) {
      const obj = caller.require(fullPath);
      hierarchy[filename] = {
        type: DOC_TYPE,
        contents: obj
      };
    }
  });

  return hierarchy;
};

export default traverse;
