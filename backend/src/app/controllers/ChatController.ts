import { Request, Response } from 'express';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { ChatParticipantRepository } from '../../domain/repositories/ChatParticipantRepository';
import { FriendRequestRepository } from '../../domain/repositories/FriendRequestRepository';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { Message } from '../../domain/entity/Message';
import { io } from '../../main';

const chatRepository = new ChatRepository();
const chatParticipantRepository = new ChatParticipantRepository();
const friendRequests = new FriendRequestRepository();
const messageRepository = new MessageRepository();

export class ChatController {
  static getMyChats = async (req: Request, res: Response) => {
    try {
      const userId = +req.params.id;
      // 4 - buscar ese chat en FriendRequestRepository y que es status sea accepted
      const chatParticipants =
        await chatParticipantRepository.findUniqueChatIdsByUserId(userId);
      const myChats =
        await chatRepository.findActiveChatsByIds(chatParticipants);

      // concatenar por cada chat friendRequestRepository.findByChatId(chatID);
      const myChatsWithFriendRequest = await Promise.all(
        myChats.map(async (chat) => {
          const [friendRequest] = await friendRequests.findByChatId(chat.id);

          const ratings =
            await chatParticipantRepository.getChatsParticipantByChatId(
              chat.id,
            );

          // Just retrunt id user and rating
          const cleanData = ratings.map((rating) => {
            return { userId: rating.user.id, rating: rating.rating };
          });

          return { ...chat, friendRequest, ratings: cleanData };
        }),
      );

      /**chatParticipantRepository.findByChatIdAndUserId */
      res.status(200).json({ chats: myChatsWithFriendRequest });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getChatByID = async (req: Request, res: Response) => {
    try {
      const chatID = +req.params.chatID;
      const chat = await chatRepository.findById(chatID);

      const [friendRequest] = await friendRequests.findByChatId(chat.id);

      res.status(200).json({ chat: friendRequest });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getAllDataChatFriendRequest = async (req: Request, res: Response) => {
    const chatID = +req.params.chatID;

    try {
      const dataChat = await friendRequests.findByChatId(chatID);

      res.status(200).json({ dataChat });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // save message
  static saveMessage = async (req: Request, res: Response) => {
    try {
      const { chatId, userId, content } = req.body;

      const newMessage = new Message();
      newMessage.chat = chatId;
      newMessage.sender = userId;
      newMessage.content = content;

      const save = await messageRepository.save(newMessage);

      // Enviar mensaje a todos los participantes del chat
      io.to(`chat-${chatId}`).emit('new-message', save);

      res.status(200).json({ message: save });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // get all messages by chatId and userId (sender) and userId (receiver)
  static getAllMessages = async (req: Request, res: Response) => {
    const { chatID } = req.params;
    try {
      const messages = await messageRepository.findAllMessagesByChatId(+chatID);
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
