module.exports = {
  displayName: '@yllet/client',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
