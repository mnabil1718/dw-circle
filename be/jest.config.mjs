/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // 1. Tell Jest which extensions to treat as ESM
  extensionsToTreatAsEsm: [".ts"],

  // 2. Configure ts-jest to use ESM
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // 3. (Optional) If you have imports that include extensions like .js in your TS files
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
