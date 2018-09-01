import unionize from '../../src/main';

unionize(module, 'testcases', {
  files: {
    required: ['expected.json']
  }
});
