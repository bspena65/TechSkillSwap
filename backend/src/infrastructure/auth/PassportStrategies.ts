import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../../domain/entity/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { UserRoleRepository } from '../../domain/repositories/UserRoleRepository';
import { UserRole } from '../../domain/entity/UserRole';
dotenv.config();

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const userRoleRepository = new UserRoleRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Estrategia JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userRepository.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extraer nombre y apellido (si existe)
        const fullName = profile.displayName || '';
        const [firstName, lastName] = fullName.split(' ');

        // Verificar si el correo está presente en el perfil
        let email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        // Si no hay correo, creamos uno usando el formato noreply de GitHub
        if (!email) {
          email = `${profile.id}@users.noreply.github.com`.toLowerCase();
        }

        // Buscar el usuario por correo electrónico
        let user = await userRepository.findByEmail(email);

        // Si no existe, creamos uno nuevo
        if (!user) {
          user = new User();
          user.email = email;
          user.firstName = firstName || 'Firstname';
          user.lastName = lastName || 'Lastname';
          user.authProvider = 'github';
          user.authProviderId = profile.id;

          user.passwordHash =
            '$2a$10$qwe08.9CyoK2DE02RkDC6.Qkj8mVKW6X7xZPJdMEyH0AC4aYVLy3u';

          user = await userRepository.save(user);
        }

        // Finalizamos la autenticación con el usuario encontrado o creado
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

// Estrategia Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Extraer los nombres de la información del perfil
        const firstName = profile.name?.givenName || 'Firstname';
        const lastName = profile.name?.familyName || 'Lastname';

        // Obtener el correo electrónico
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(new Error('No email found for Google profile'), false);
        }

        // Buscar el usuario en la base de datos
        let user = await userRepository.findByEmail(email);

        // Si el usuario no existe, lo creamos
        if (!user) {
          user = new User();
          user.email = email;
          user.firstName = firstName;
          user.lastName = lastName;
          user.authProvider = 'google';
          user.authProviderId = profile.id;

          // Crear un password hash por defecto para los usuarios de OAuth (no lo usarán, pero debe existir)
          user.passwordHash = await bcrypt.hash('Mipass2024#', 10); // Contraseña por defecto

          // Guardar el usuario en la base de datos
          user = await userRepository.save(user);

          // Asignar el roles student y mentor al usuario
          const rolesDefault = await roleRepository.findByNames([
            'student',
            'mentor',
          ]);

          // Save user roles on UserRoles table
          for (const role of rolesDefault) {
            const userRole = new UserRole();
            userRole.user = user;
            userRole.role = role;

            await userRoleRepository.save(userRole);
          }
        }

        // Finalizamos la autenticación con el usuario encontrado o creado
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
