import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

import { connectDB } from './cypress/support/tasks';

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
    API_BASE_URL: 'http://localhost:3001/api',
    JWT_SECRET: 'secret',
  },
});
