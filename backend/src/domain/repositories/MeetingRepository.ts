import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Meeting } from '../entity/Meeting';

export class MeetingRepository {
  private meetingRepository = AppDataSource.getRepository(Meeting);

  // Crear una nueva reunión
  async create(meetingData: Partial<Meeting>): Promise<Meeting> {
    const meeting = this.meetingRepository.create(meetingData);
    return await this.meetingRepository.save(meeting);
  }

  // Obtener todas las reuniones
  async findAll(): Promise<Meeting[]> {
    return await this.meetingRepository.find({
      relations: ['organizer', 'chat'], // Incluye relaciones necesarias
    });
  }

  // Obtener una reunión por ID
  async findById(id: number): Promise<Meeting | undefined> {
    return await this.meetingRepository.findOne({
      where: { id },
      relations: ['organizer', 'chat'], // Incluye relaciones necesarias
    });
  }

  // Actualizar una reunión por ID
  async update(
    id: number,
    updatedData: Partial<Meeting>,
  ): Promise<Meeting | undefined> {
    await this.meetingRepository.update(id, updatedData);
    return this.findById(id);
  }

  // Eliminar una reunión por ID
  async delete(id: number): Promise<void> {
    await this.meetingRepository.delete(id);
  }

  // Buscar reuniones por userId (organizador)
  async findByUserId(userId: number): Promise<Meeting[]> {
    return await this.meetingRepository.find({
      where: { organizer: { id: userId } },
      relations: ['organizer', 'chat'], // Incluye las relaciones necesarias
    });
  }

  // Buscar reuniones por chatId
  async findByChatId(chatId: number): Promise<Meeting[]> {
    return await this.meetingRepository.find({
      where: { chat: { id: chatId } },
      relations: ['organizer', 'chat'], // Incluye las relaciones necesarias
    });
  }
}
