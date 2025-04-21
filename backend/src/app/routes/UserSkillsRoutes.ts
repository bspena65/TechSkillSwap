import { Router } from 'express';
import { UserSkillController } from '../controllers/UserSkillController';

const router = Router();

// Guardar o actualizar un userSkill
router.post('/', UserSkillController.save);

// Listar todas las habilidades de usuario con paginación
router.get('/', UserSkillController.findAll);

// Obtener una habilidad de usuario por ID
router.get('/:id', UserSkillController.findById);

// Actualizar una habilidad de usuario por ID
router.put('/:id', UserSkillController.update);

// Eliminar una habilidad de usuario por ID
router.delete('/:id', UserSkillController.delete);

// get Skill by user id
router.get('/user/:userId', UserSkillController.findByUserId);

export default router;
