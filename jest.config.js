module.exports = {
  projects: [ '<rootDir>/packages/*/jest.config.js'],
  cacheDirectory: ".jest-cache",
  testPathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/lib/"],
};
