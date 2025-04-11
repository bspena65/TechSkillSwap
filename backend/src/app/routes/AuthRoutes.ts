import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import passport from '../../infrastructure/auth/PassportStrategies';

const router = Router();

// Ruta de registro
router.post('/register', AuthController.register);

// Ruta de login
router.post('/login', AuthController.login);

// Ruta para iniciar la autenticación con GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

// Ruta para obtener el usuario autenticado por JWT
router.get('/me', AuthController.getUser);

// Ruta de callback a la que GitHub redirige después de la autenticación
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  AuthController.githubCallback,
);

// Rutas para iniciar la autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback a la que Google redirige después de la autenticación
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  AuthController.googleCallback,
);

export default router;
