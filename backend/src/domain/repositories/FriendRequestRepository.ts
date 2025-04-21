import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { FriendRequest } from '../entity/FriendRequest';

export class FriendRequestRepository {
  private friendRequestRepository = AppDataSource.getRepository(FriendRequest);

  // Método para guardar un friendRequest (Crear o Actualizar)
  async save(friendRequest: FriendRequest): Promise<FriendRequest> {
    return await this.friendRequestRepository.save(friendRequest);
  }

  // Método para obtener todas las solicitudes de conexión por receiverId
  async findByReceiverId(
    receiverId: number,
    page?: number,
    perPage?: number,
  ): Promise<{ data: FriendRequest[]; total: number }> {
    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    const [friendRequests, total] =
      await this.friendRequestRepository.findAndCount({
        where: { receiver: { id: receiverId } }, // Filtro por receiverId
        skip: page ? skip : undefined,
        take: page ? take : undefined,
        order: { id: 'ASC' }, // Ordenar por ID ascendente
        relations: [
          'sender',
          'receiver',
          'skillSender',
          'skillReceiver',
          'chat',
        ],
      });

    return { data: friendRequests, total };
  }

  // Método para obtener todas las solicitudes de conexión por receiverId
  async findBySenderIdPaginate(
    senderId: number,
    page?: number,
    perPage?: number,
  ): Promise<{ data: FriendRequest[]; total: number }> {
    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    const [friendRequests, total] =
      await this.friendRequestRepository.findAndCount({
        where: { sender: { id: senderId } },
        skip: page ? skip : undefined,
        take: page ? take : undefined,
        order: { id: 'ASC' }, // Ordenar por ID ascendente
        relations: [
          'sender',
          'receiver',
          'skillSender',
          'skillReceiver',
          'chat',
        ],
      });

    return { data: friendRequests, total };
  }

  // Método para obtener todas las solicitudes de conexión por senderId sin paginación
  async findBySenderId(senderId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: { sender: { id: senderId } },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }

  // Método para obtener todas las solicitudes de conexión por senderId sin paginación
  async findByRecieverdSinPag(receiverId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: { receiver: { id: receiverId } },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }

  // Método para obtener todas las solicitudes de conexión por senderId sin paginación
  async findByRecieverdAndSender(
    receiverId: number,
    senderId: number,
  ): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: { receiver: { id: receiverId }, sender: { id: senderId } },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }

  // Método para obtener todas las solicitudes de conexión con paginación
  async findAll(
    page?: number,
    perPage?: number,
  ): Promise<{ data: FriendRequest[]; total: number }> {
    const take = perPage || 0; // Si no se especifica perPage, se obtendrán todos
    const skip = page ? (page - 1) * take : 0; // Si no se especifica página, no se salta ningún registro

    const [friendRequests, total] =
      await this.friendRequestRepository.findAndCount({
        skip: page ? skip : undefined, // Solo se hace skip si se especifica page
        take: page ? take : undefined, // Solo se limita el número de resultados si se especifica perPage
        order: {
          id: 'ASC', // Ordenar por ID ascendente
        },
      });

    return { data: friendRequests, total };
  }

  // Método para buscar un friendRequest por ID (Leer)
  async findById(id: number): Promise<FriendRequest | undefined> {
    return await this.friendRequestRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }

  findByChatId(chatId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }
  
  // Método para actualizar un friendRequest
  async update(
    id: number,
    updatedFriendRequest: Partial<FriendRequest>,
  ): Promise<FriendRequest | undefined> {
    await this.friendRequestRepository.update(id, updatedFriendRequest);
    return await this.friendRequestRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'skillSender', 'skillReceiver', 'chat'],
    });
  }

  // Método para eliminar un friendRequest
  async delete(id: number): Promise<void> {
    await this.friendRequestRepository.delete(id);
  }
}
