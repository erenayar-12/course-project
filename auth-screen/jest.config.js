/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/*.test.ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  maxWorkers: 1,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: {
          jsx: 'react-jsx',
          jsxImportSource: 'react',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          module: 'esnext',
          target: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          moduleResolution: 'node',
          skipLibCheck: true,
          types: ['jest', '@testing-library/jest-dom', 'vite/client', 'node']
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/**/__tests__',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
