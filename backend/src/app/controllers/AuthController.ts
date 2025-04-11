import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../domain/entity/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { UserRoleRepository } from '../../domain/repositories/UserRoleRepository';
import { UserRole } from '../../domain/entity/UserRole';

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const userRoleRepository = new UserRoleRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

export class AuthController {
  // Ruta para obtener el usuario autenticado por JWT
  static async getUser(req: Request, res: Response): Promise<Response> {
    try {
      // Obtener el token de la cabecera de autorización
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      // Verificar y decodificar el token
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Buscar al usuario en la base de datos
      const user = await userRepository.findByIdAllData(decoded.id);

      // remove passwordHash from user object with spread operator
      // delete user.passwordHash;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Devolver los datos del usuario
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  // Registro de un nuevo usuario
  static async register(req: Request, res: Response): Promise<Response> {
    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await userRepository.findByEmail(email);

      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Crear nuevo usuario
      user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.passwordHash = await bcrypt.hash(password, 10);

      await userRepository.save(user);

      // Asignar el roles student y mentor al usuario
      const rolesDefault = await roleRepository.findByNames(['student', 'mentor']); 
      
      // Save user roles on UserRoles table
      for (const role of rolesDefault) {
        const userRole = new UserRole();
        userRole.user = user;
        userRole.role = role;
        
        await userRoleRepository.save(userRole);
      }

      // Crear token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1y',
      });

      return res.status(201).json({ token, user });
    } catch (error) {
      return res.status(500).json({ message: 'Error registering user', error });
    }
  }

  // Inicio de sesión
  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Buscar al usuario en la base de datos

      const userData = {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        profile_picture_url: user.profilePictureUrl,
        bio: user.bio,
        auth_provider: user.authProvider,
        roles: user.userRoles.map((userRole) => userRole.role.roleName),
      };

      // Crear token JWT
      const token = jwt.sign(userData, JWT_SECRET, {
        expiresIn: '1y',
      });

      return res.status(200).json({ token, user:userData });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in', error });
    }
  }

  // Callback para manejar la respuesta de GitHub
  static async githubCallback(req: Request, res: Response): Promise<Response> {
    try {
      // En este punto, Passport ha autenticado al usuario y lo ha añadido al objeto `req.user`
      //@ts-ignore
      const user = req.user as any;

      // Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1y',
      });

      // Redirigir al frontend con el token en la URL
      res.redirect(`http://localhost:5173/auth/login/success?token=${token}`);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error during GitHub login', error });
    }
  }

  // Callback para manejar la respuesta de Google
  static async googleCallback(req: Request, res: Response): Promise<Response> {
    try {
      // En este punto, Passport ha autenticado al usuario y lo ha añadido al objeto `req.user`
      //@ts-ignore
      const user = req.user as any;

      // Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1y',
      });

      // Redirigir al frontend con el token en la URL
      res.redirect(`http://localhost:5173/auth/login/success?token=${token}`);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error during Google login', error });
    }
  }
}
