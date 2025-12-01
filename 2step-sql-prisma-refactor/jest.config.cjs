module.exports = {
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
      setupFiles: ["<rootDir>/tests/setup/setupUnit.js"],
      testEnvironment: "node"
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/*.test.js"],

      setupFiles: ["<rootDir>/tests/setup/setupIntegrationEnv.js"],

      setupFilesAfterEnv: ["<rootDir>/tests/setup/setupIntegration.js"],

      testEnvironment: "node"
    }
  ]
};
