module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: './(test|src)/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/test', '<rootDir>/src'],
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "../coverage",
};