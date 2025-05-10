const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: '../cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    // Remove or modify this line:
    supportFile: '../cypress/support/e2e.js' // DEFAULT (recommended)
  },
  env: {
    apiUrl: 'http://localhost:5000/api',
  },
});