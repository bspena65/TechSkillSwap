import { Router } from 'express';
import { UserProfessionalStudyController } from '../controllers/UserProfessionalStudyController';

const router = Router();

// Crear un nuevo estudio profesional
router.post('/', UserProfessionalStudyController.create);

// Obtener todos los estudios profesionales con paginación
router.get('/', UserProfessionalStudyController.findAll);

// Obtener un estudio profesional por ID
router.get('/:study_id', UserProfessionalStudyController.findById);

// Actualizar un estudio profesional por ID
router.put('/:study_id', UserProfessionalStudyController.update);

// Eliminar un estudio profesional por ID
router.delete('/:study_id', UserProfessionalStudyController.delete);

export default router;
