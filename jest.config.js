// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     testMatch: ['**/*.test.ts'],
//   };

  module.exports = {
    testEnvironment: 'node', // lub 'jsdom' dla testów przeglądarkowych
    testMatch: ['**/*.test.ts'], // znajdź pliki testowe
    transform: {
      '^.+\\.tsx?$': 'babel-jest', // użyj babel-jest do transpilacji TypeScript
    },
  };