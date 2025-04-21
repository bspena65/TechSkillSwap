import { Request, Response } from 'express';
import { RatingRepository } from '../../domain/repositories/RatingRepository';
import { ChatParticipantRepository } from '../../domain/repositories/ChatParticipantRepository';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { ChatStatus } from '../../domain/entity/Chat';

const ratingRepository = new RatingRepository();
const chatParticipantRepository = new ChatParticipantRepository();
const chatRepository = new ChatRepository();

export class RatingController {
  // Crear un nuevo rating
  static async create(req: Request, res: Response) {
    const ratingData = req.body;

    try {
      const rating = await ratingRepository.save(ratingData);

      const chatParticipant =
        await chatParticipantRepository.findByChatIdAndUserId(
          parseInt(ratingData.chatID as string, 10),
          parseInt(ratingData.userID as string, 10),
        );

      chatParticipant.rating = rating;
      await chatParticipantRepository.save(chatParticipant);

      // Change chat status to completed
      const chat = await chatRepository.findById(ratingData.chatID);
      chat.status = ChatStatus.INACTIVE;

      await chatRepository.save(chat);

      return res.status(201).json(rating);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al crear la calificación', error });
    }
  }

  // Obtener todas las calificaciones
  static async findAll(req: Request, res: Response) {
    try {
      const ratings = await ratingRepository.findAll();
      return res.status(200).json(ratings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener las calificaciones', error });
    }
  }

  // Obtener una calificación por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const rating = await ratingRepository.findById(id);
      if (!rating) {
        return res.status(404).json({ message: 'Calificación no encontrada' });
      }
      return res.status(200).json(rating);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener la calificación', error });
    }
  }

  // Actualizar una calificación por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body;

    try {
      const updatedRating = await ratingRepository.update(id, updatedData);
      if (!updatedRating) {
        return res.status(404).json({ message: 'Calificación no encontrada' });
      }
      return res.status(200).json(updatedRating);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al actualizar la calificación', error });
    }
  }

  // Eliminar una calificación por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await ratingRepository.delete(id);
      return res
        .status(200)
        .json({ message: 'Calificación eliminada con éxito' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar la calificación', error });
    }
  }

  // Buscar una calificación por chatParticipantId
  static async findByChatParticipantId(req: Request, res: Response) {
    const chatParticipantId = parseInt(req.params.chatParticipantId, 10);

    try {
      const rating =
        await ratingRepository.findByChatParticipantId(chatParticipantId);
      if (!rating) {
        return res.status(404).json({
          message: 'Calificación no encontrada para el participante del chat',
        });
      }
      return res.status(200).json(rating);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener la calificación del participante del chat',
        error,
      });
    }
  }

  static async findMyRatings(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);

    try {
      const ratings =
        await ratingRepository.getAllRatingsByOwnerCalificateId(userId);
      return res.status(200).json(ratings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener las calificaciones', error });
    }
  }
}
