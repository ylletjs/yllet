module.exports = {
  cacheDirectory: ".jest-cache",
  coverageDirectory: '.jest-coverage',
  projects: ["<rootDir>/packages/*/jest.config.js"],
  testPathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/lib/"],
  coveragePathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/lib/"],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};
