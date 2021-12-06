const path = require('path');

module.exports = {
  projects: ['<rootDir>/packages/*/jest.config.js'],
  testPathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover']
};
