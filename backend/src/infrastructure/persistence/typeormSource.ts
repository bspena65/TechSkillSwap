import 'reflect-metadata';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'test',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.DB_DATABASE || 'test',
  synchronize: false,
  logging: false,
  entities: ['src/domain/entity/*.ts'],
  migrations: ['src/infrastructure/persistence/migration/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // Desactiva la verificación del certificado (útil para desarrollo)
  },


});
