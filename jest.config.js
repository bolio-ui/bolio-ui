module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/core', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'core/**/*.{ts,tsx}',
    '!core/**/stories.tsx',
    '!core/**/*.d.ts',
    '!core/**/__tests__/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts']
}
