const { defineConfig } = require("cypress");

module.exports = defineConfig({
 

    baseurl:'https://hml-bff.barte.com/',

    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'BARTE',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,

  },


  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});