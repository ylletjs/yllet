const path = require('path');

module.exports = {
  projects: ['<rootDir>/packages/*/jest.config.js'],
  testPathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/dist/'],
  coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/dist/'],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover']
};
