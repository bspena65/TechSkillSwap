import { Request, Response } from 'express';
import { UserSeederService } from '../useCases/SeedDataService';

export class SeedController {


  public async runSeed(req: Request, res: Response): Promise<Response> {
    try {
      const userSeederService = new UserSeederService();
      await userSeederService.seed();
      return res
        .status(200)
        .json({ message: 'Database seeding completed successfully.' });
    } catch (error) {
      console.error('Error during database seeding:', error);
      return res
        .status(500)
        .json({ message: 'An error occurred during database seeding.' +error});
    }
  }
}
