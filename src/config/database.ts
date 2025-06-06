import { DataSource } from 'typeorm';
import { AccountingEntry } from '../entities/AccountingEntry';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'lain',
  password: process.env.DB_PASSWORD || 'lain',
  database: process.env.DB_DATABASE || 'accounting_db',
  synchronize: true,
  logging: true,
  entities: [AccountingEntry],
  migrations: [],
  subscribers: [],
}); 