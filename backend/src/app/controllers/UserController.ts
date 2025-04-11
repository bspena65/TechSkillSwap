import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { FriendRequestRepository } from '../../domain/repositories/FriendRequestRepository';

const userRepository = new UserRepository();
const friendRequestRepository = new FriendRequestRepository();

export class UserController {
  // Método para crear un usuario
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const newUser = await userRepository.save(req.body);
      return res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user', error });
    }
  }

  // Método para actualizar solo name label y location de un usuario
  static async updateNameLabelLocation(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { id } = req.params;
    const { firstName, lastName, location, labelProfile } = req.body;

    if (!firstName || !lastName || !location || !labelProfile) {
      return res.status(400).json({
        message: 'Name, label ,labelProfile and location are required',
      });
    }

    try {
      const updatedUser = await userRepository.updateNameLabelLocation(
        Number(id),
        firstName,
        lastName,
        location,
        labelProfile,
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        message: 'Name, label and location updated',
        user: updatedUser,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error updating name, label and location', error });
    }
  }

  // Método para actualizar solo la imagen de perfil de un usuario
  static async updateProfilePictureUrl(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { id } = req.params;

    try {
      // Primero buscamos el usuario
      const user = await userRepository.findById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verificamos que haya un archivo subido
      // @ts-ignore
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Guardamos la URL de la foto en la base de datos
      // @ts-ignore
      const profilePictureUrl = `/uploads/${req.file.filename}`;
      await userRepository.updateProfilePictureUrl(
        Number(id),
        profilePictureUrl,
      );

      return res
        .status(200)
        .json({ message: 'Profile picture updated', profilePictureUrl });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error updating profile picture', error });
    }
  }

  // Método para actualizar solo la bio de un usuario
  static async updateBio(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { bio } = req.body;

    if (!bio) {
      return res.status(400).json({ message: 'Bio is required' });
    }

    try {
      const updatedUser = await userRepository.updateBio(Number(id), bio);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res
        .status(200)
        .json({ message: 'Bio updated', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating bio', error });
    }
  }

  // Método para actualizar un usuario
  static async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const updatedUser = await userRepository.update(Number(id), req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res
        .status(200)
        .json({ message: 'User updated', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error });
    }
  }

  // Método para eliminar un usuario
  static async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await userRepository.delete(Number(id));
      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  // Método para buscar un usuario por ID
  static async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const user = await userRepository.findByIdAllData(Number(id));
      const friendsRequest = await friendRequestRepository.findByRecieverdSinPag(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({user, friendsRequest: friendsRequest});
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching user by ID', error });
    }
  }


  // Método para buscar un usuario por ID
  static async getByIdAndSender(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    // get senderId by query
    const senderId = +req.query.senderId;
    try {
      const user = await userRepository.findByIdAllData(Number(id));
      const friendsRequest =
        await friendRequestRepository.findByRecieverdAndSender(
          Number(id),
          senderId,
        );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ user, friendsRequest: friendsRequest });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching user by ID', error });
    }
  }

  // Método para búsqueda avanzada
  static async searchAdvanced(req: Request, res: Response): Promise<Response> {
    const { userName, roleName, skillName, languageName } = req.query;

    try {
      const users = await userRepository.searchAdvanced({
        userName: userName as string,
        roleName: roleName as string,
        skillName: skillName as string,
        languageName: languageName as string,
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error searching users', error });
    }
  }

  // Método para buscar usuarios por una palabra clave en todos los datos
  static async searchByJustWordAllData(
    req: Request,
    res: Response,
  ): Promise<Response> {
    let { keyword } = req.query as { keyword: string };

    // Put keyword default if not provided
    if (!keyword) {
      keyword = 'a';
    }

    try {
      const users = await userRepository.searchByJustWordAllData(keyword);
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al buscar usuarios', error });
    }
  }
}
