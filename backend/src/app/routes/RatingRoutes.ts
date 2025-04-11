import { Router } from 'express';
import { RatingController } from '../controllers/RatingController';

const router = Router();

// Ruta para crear una nueva calificación
router.post('/', RatingController.create);

// Ruta para obtener todas las calificaciones
router.get('/', RatingController.findAll);

// Ruta para obtener una calificación por ID
router.get('/:id', RatingController.findById);

// Ruta para actualizar una calificación por ID
router.put('/:id', RatingController.update);

// Ruta para eliminar una calificación por ID
router.delete('/:id', RatingController.delete);
router.get('/findMyRatings/:userId', RatingController.findMyRatings);

// Ruta para obtener una calificación por chatParticipantId
router.get(
  '/participant/:chatParticipantId',
  RatingController.findByChatParticipantId,
);

export default router;
