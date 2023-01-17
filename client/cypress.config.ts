import { defineConfig } from 'cypress';
import { Client } from 'pg';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('task', {
        async connectDB(query): Promise<any> {
          const client = new Client({
            user: 'charukv',
            password: 'postgres',
            host: 'localhost',
            database: 'hvoya_crm_test',
            ssl: false,
            port: 5432,
          });
          await client.connect();
          const res = await client.query(query);
          await client.end();
          return res.rows;
        },
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
