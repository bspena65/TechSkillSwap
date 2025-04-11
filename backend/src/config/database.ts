import { AppDataSource } from '../infrastructure/persistence/typeormSource';

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.info('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};
