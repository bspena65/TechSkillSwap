import { Router } from 'express';
import { SkillController } from '../controllers/SkillController';

const router = Router();

// Crear un nuevo skill
router.post('/', SkillController.create);

// Listar todos los skills con paginación y relación a SkillCategory
router.get('/', SkillController.findAll);

// Obtener un skill por ID
router.get('/getbyid/:id', SkillController.findById);

// Actualizar un skill por ID
router.put('/:id', SkillController.update);

// Eliminar un skill por ID
router.delete('/:id', SkillController.delete);

router.get('/getall', SkillController.findAllList);
export default router;
