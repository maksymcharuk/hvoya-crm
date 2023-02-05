import * as dotenv from 'dotenv';
import { defineConfig } from 'cypress';
import { connectDB } from 'cypress/support/tasks';

dotenv.config({ path: '../env/test.env' });

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4201',
    supportFile: 'cypress/support/e2e.ts',
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on('task', {
        connectDB,
      });
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },

  env: {
    JWT_SECRET: 'secret',
  },
});
