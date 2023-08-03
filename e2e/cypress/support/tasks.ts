import { Client, QueryResult } from 'pg';

export const connectDB = async (query: string): Promise<QueryResult> => {
  const client = new Client({
    user: process.env['DB_USERNAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    database: process.env['DB_NAME'] || 'hvoya_crm_test',
    ssl: false,
    port: parseInt(process.env['DB_PORT'] || '5432'),
  });
  await client.connect();
  const res = await client.query(query);
  await client.end();
  return res;
};
