module.exports = {
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
      testEnvironment: "node"
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/setupIntegration.js"],
      testEnvironment: "node"
    },
    {
      displayName: "explain",
      testMatch: ["<rootDir>/tests/explain/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
      testEnvironment: "node"
    },
  ],
};
