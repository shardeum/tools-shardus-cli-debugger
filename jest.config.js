module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!**/node_modules/**', '!**/vendor/**'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 55,
      statements: 55,
    },
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  testMatch: ['**/test/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
}
