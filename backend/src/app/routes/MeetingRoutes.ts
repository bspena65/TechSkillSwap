import { Router } from 'express';
import { MeetingController } from '../controllers/MeetingController';

const router = Router();

// Crear una nueva reunión
router.post('/', MeetingController.create);

// Obtener todas las reuniones
router.get('/', MeetingController.findAll);

// Obtener una reunión por ID
router.get('/:id', MeetingController.findById);

// Actualizar una reunión por ID
router.put('/:id', MeetingController.update);

// Eliminar una reunión por ID
router.delete('/:id', MeetingController.delete);

// Buscar reuniones por userId (organizador)
router.get('/user/:userId', MeetingController.findByUserId);

// Buscar reuniones por chatId
router.get('/chat/:chatId', MeetingController.findByChatId);

export default router;
