import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Rating } from '../entity/Rating';

export class RatingRepository {
  private ratingRepository = AppDataSource.getRepository(Rating);

  // Método para guardar un rating (Crear o Actualizar)
  async save(rating: Rating): Promise<Rating> {
    return await this.ratingRepository.save(rating);
  }

  // Método para encontrar un rating por chatParticipantId
  async findByChatParticipantId(
    chatParticipantId: number,
  ): Promise<Rating | undefined> {
    return await this.ratingRepository.findOne({
      where: { chatParticipant: { id: chatParticipantId } },
      relations: ['chatParticipant'],
    });
  }

  // Método para obtener todas las calificaciones
  async findAll(): Promise<Rating[]> {
    return await this.ratingRepository.find({
      relations: ['chatParticipant'], // Asegúrate de cargar las relaciones necesarias
    });
  }

  // Método para actualizar un rating
  async update(
    id: number,
    updatedRating: Partial<Rating>,
  ): Promise<Rating | undefined> {
    await this.ratingRepository.update(id, updatedRating);
    return await this.ratingRepository.findOne({
      where: { id },
      relations: ['chatParticipant'],
    });
  }

  // Método para eliminar un rating
  async delete(id: number): Promise<void> {
    await this.ratingRepository.delete(id);
  }

  // Método para buscar un rating por ID
  async findById(id: number): Promise<Rating | undefined> {
    return await this.ratingRepository.findOne({
      where: { id },
      relations: ['chatParticipant'],
    });
  }

  // Método para obtener todas las calificaciones de un ownerCalificateId específico
  async getAllRatingsByOwnerCalificateId(
    ownerCalificateId: number,
  ): Promise<Rating[]> {
    console.log(
      `Fetching all ratings for ownerCalificateId: ${ownerCalificateId}`,
    );

    // Realiza la consulta utilizando el repositorio
    return await this.ratingRepository.find({
      where: {
        ownerCalificate: {
          id: ownerCalificateId,
        },
      },
      relations: ['calificator'], // Incluir relaciones si es necesario
    });
  }
}
