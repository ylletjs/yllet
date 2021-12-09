module.exports = {
  name: '@yllet/client',
  displayName: '@yllet/client',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};
