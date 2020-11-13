module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testMatch: ['**/__tests__/**/*test.(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  watchPathIgnorePatterns: ['.*/generated/'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
  // Добавил <rootDir>/src/next/, чтобы резолвились пути к модулям
  modulePaths: ['<rootDir>', '<rootDir>/src/next/'],
  testURL: 'http://localhost:3000',
  preset: 'ts-jest/presets/js-with-babel',
  collectCoverageFrom: [
    './(src|dev)/**/*.{ts,tsx,js,jsx,d.ts,d.tsx}',
    '!./dev/server/**',
    '!**/node_modules/**',
    '!**.next/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/storybook-static/**',
    '!**/generated/**',
  ],
}
