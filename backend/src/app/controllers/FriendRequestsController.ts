import { ChatParticipant } from './../../domain/entity/ChatParticipant';
import { Request, Response } from 'express';
import { FriendRequestRepository } from '../../domain/repositories/FriendRequestRepository';
import { FriendRequest } from '../../domain/entity/FriendRequest';
import { io } from '../../main';
import { personalizedMessage } from '../../shared/utils/mshSolicitud';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { Chat } from '../../domain/entity/Chat';
import { ChatParticipantRepository } from '../../domain/repositories/ChatParticipantRepository';

const friendRequestRepository = new FriendRequestRepository();
const chatRepository = new ChatRepository();
const chatParticipantRepository = new ChatParticipantRepository();

export class FriendRequestController {
  // Crear una nueva solicitud de conexión
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const friendRequest = await friendRequestRepository.save(
        req.body as FriendRequest,
      );

      const reciverIdRoom = String(friendRequest.receiver.id);

      // Emitir evento de nueva solicitud de conexión al receptor
      io.to(reciverIdRoom).emit('newFriendRequest', {
        message: 'Tienes una nueva solicitud de conexión',
      });

      return res.status(201).json(friendRequest);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error creando la solicitud de conexión', error });
    }
  }

  // Obtener todas las solicitudes de conexión por receiverId con paginación
  static async getByReceiverId(req: Request, res: Response): Promise<Response> {
    try {
      const receiverId = parseInt(req.params.receiverId);
      const page = parseInt(req.query.page as string) || undefined;
      const perPage = parseInt(req.query.perPage as string) || undefined;

      if (isNaN(receiverId)) {
        return res.status(400).json({ message: 'Invalid receiverId' });
      }

      const { data, total } = await friendRequestRepository.findByReceiverId(
        receiverId,
        page,
        perPage,
      );

      return res.status(200).json({ data, total });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error retrieving friend requests', error });
    }
  }

  // Obtener todas las solicitudes de conexión por senderId con paginación
  static async getBySenderId(req: Request, res: Response): Promise<Response> {
    try {
      const senderId = parseInt(req.params.senderId);
      const page = parseInt(req.query.page as string) || undefined;
      const perPage = parseInt(req.query.perPage as string) || undefined;

      if (isNaN(senderId)) {
        return res.status(400).json({ message: 'Invalid senderId' });
      }

      const { data, total } =
        await friendRequestRepository.findBySenderIdPaginate(
          senderId,
          page,
          perPage,
        );

      return res.status(200).json({ data, total });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error retrieving sender friend requests', error });
    }
  }

  // Listar todas las solicitudes de conexión con paginación
  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 5;
      const { data, total } = await friendRequestRepository.findAll(
        page,
        perPage,
      );
      return res.status(200).json({ data, total });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error obteniendo solicitudes de conexión', error });
    }
  }

  // Obtener una solicitud de conexión por ID
  static async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const friendRequest = await friendRequestRepository.findById(id);
      if (!friendRequest) {
        return res
          .status(404)
          .json({ message: 'Solicitud de conexión no encontrada' });
      }
      return res.status(200).json(friendRequest);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error obteniendo la solicitud de conexión', error });
    }
  }

  // Actualizar una solicitud de conexión por ID
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const updatedFriendRequest = await friendRequestRepository.update(
        id,
        req.body as Partial<FriendRequest>,
      );

      if (!updatedFriendRequest) {
        return res
          .status(404)
          .json({ message: 'Solicitud de conexión no encontrada' });
      }

      // Verificar si el estado es "accepted"
      if (updatedFriendRequest.status === 'accepted') {
        // 1. Crear un nuevo chat
        const chat = new Chat();
        chat.name = `Chat between ${updatedFriendRequest.sender.id} and ${updatedFriendRequest.receiver.id}`;
        const createdChat = await chatRepository.save(chat);

        // 2. Crear participantes del chat
        const senderParticipant = new ChatParticipant();
        senderParticipant.chat = createdChat;
        senderParticipant.user = updatedFriendRequest.sender;
        await chatParticipantRepository.save(senderParticipant);

        const receiverParticipant = new ChatParticipant();
        receiverParticipant.chat = createdChat;
        receiverParticipant.user = updatedFriendRequest.receiver;
        await chatParticipantRepository.save(receiverParticipant);

        // 3. Asociar el chat a la solicitud de conexión
        updatedFriendRequest.chat = createdChat;
        await friendRequestRepository.save(updatedFriendRequest); // Guardar cambios en la solicitud de amistad
      }
      // Emitir evento de nueva solicitud de conexión al receptor
      const reciverIdRoom = String(updatedFriendRequest.sender.id);
      const personalizedMessageString = personalizedMessage(
        updatedFriendRequest.status,
      );

      io.to(reciverIdRoom).emit('newFriendRequest', {
        message: String(personalizedMessageString),
      });

      return res.status(200).json(updatedFriendRequest);
    } catch (error) {
      return res.status(500).json({
        message: 'Error actualizando la solicitud de conexión',
        error,
      });
    }
  }

  // Eliminar una solicitud de conexión por ID
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      await friendRequestRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error eliminando la solicitud de conexión', error });
    }
  }

  // Listar todas las solicitudes de conexión sin paginación (opcional)
  static async findAllList(req: Request, res: Response): Promise<Response> {
    try {
      const { data } = await friendRequestRepository.findAll();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: 'Error obteniendo la lista de solicitudes de conexión',
        error,
      });
    }
  }
}
