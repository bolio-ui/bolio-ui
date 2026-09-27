module.exports = {
  testEnvironment: 'jsdom',
  // same imports as the site: 'core' and 'src/...' come from the tsconfig baseUrl
  moduleDirectories: ['node_modules', '<rootDir>'],
  roots: ['<rootDir>/core', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Real CSS Modules scoping isn't needed in jsdom tests, just a stable
  // classname per key so `styles.root` etc. resolve to something.
  moduleNameMapper: { '\\.module\\.css$': 'identity-obj-proxy' },
  collectCoverageFrom: [
    'core/**/*.{ts,tsx}',
    '!core/**/stories.tsx',
    '!core/**/*.d.ts',
    '!core/**/__tests__/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts']
}
