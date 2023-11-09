const { defineConfig } = require("cypress");

module.exports = defineConfig({
 
  baseurl:'https://hml-bff.barte.com/',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
