module.exports = {
  cacheDirectory: '.jest-cache',
  coverageDirectory: '.jest-coverage',
  projects: ['<rootDir>/packages/*/jest.config.js'],
  testPathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
