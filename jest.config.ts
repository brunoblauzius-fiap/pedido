export default {
  preset: 'ts-jest', // Define o preset para TypeScript
  testEnvironment: 'node', // Define o ambiente de teste (Node.js)
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$', // Padrão para encontrar arquivos de teste
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensões de arquivos a serem consideradas
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforma arquivos TypeScript
    '^.+\\.jsx?$': 'babel-jest', // Adicione esta linha para suportar módulos ES6
  },
  
  testTimeout: 120000,
  verbose: true,
  // detectOpenHandles: true,
  collectCoverage: true,
  coverageThreshold: {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  //forceExit: true,
  // transformIgnorePatterns: ['./node_modules'],
  setupFiles: ['dotenv/config'],
};
