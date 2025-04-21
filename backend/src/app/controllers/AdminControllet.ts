import { Request, Response } from 'express';
import { AppDataSource } from '../../infrastructure/persistence/typeormSource';

export class AdminController {
  static async deleteRequestMessageChats(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`
          TRUNCATE TABLE 
            "FriendRequests",
            "ChatParticipants",
            "Messages",
            "Chats",
            "Meetings",
            "Ratings"
          RESTART IDENTITY CASCADE;
        `);

      await queryRunner.commitTransaction();
      return res.status(200).json({ message: 'All request messages deleted' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res
        .status(500)
        .json({ message: 'Error truncating tables', error });
    }
  }
}
