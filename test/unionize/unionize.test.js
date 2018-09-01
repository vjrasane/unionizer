import unionize from '../../src/main';

unionize(module, 'testcases', {
  files: {
    required: ['input.json', 'expected.json']
  }
});
