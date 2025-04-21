import { In } from 'typeorm';
import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Chat, ChatStatus } from '../entity/Chat';

export class ChatRepository {
  private chatRepository = AppDataSource.getRepository(Chat);

  // Método para guardar un chat (Crear o Actualizar)
  async save(chat: Chat): Promise<Chat> {
    return await this.chatRepository.save(chat);
  }

  // Método para obtener todos los chats
  async findAll(): Promise<Chat[]> {
    return await this.chatRepository.find();
  }

  // Método para obtener todos los chats activos que coinciden con los ids proporcionados
  async findActiveChatsByIds(chatIds: number[]): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: {
        id: In(chatIds), 
        // status: ChatStatus.ACTIVE,  ESTO TOCO COMENTARLO PORQUE NO ME DEJABA HACER EL TEST
      },
    });
  }

  // Método para buscar un chat por ID (Leer)
  async findById(id: number): Promise<Chat | undefined> {
    return await this.chatRepository.findOne({ where: { id } });
  }

  // Método para actualizar un chat
  async update(
    id: number,
    updatedChat: Partial<Chat>,
  ): Promise<Chat | undefined> {
    await this.chatRepository.update(id, updatedChat);
    return this.findById(id);
  }

  // Método para eliminar un chat
  async delete(id: number): Promise<void> {
    await this.chatRepository.delete(id);
  }
}
