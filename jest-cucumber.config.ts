import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/BDD/step-definitions/*.steps.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest', // Adicione esta linha para suportar módulos ES6
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(chai)/)', // ignore tudo em node_modules, exceto o pacote chai
  ],
  testTimeout: 120000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};

export default config;
