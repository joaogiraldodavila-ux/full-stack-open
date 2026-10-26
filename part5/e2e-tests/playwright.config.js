// playwright.config.js
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests', // <--- Añade esta línea para que reconozca la carpeta
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
})