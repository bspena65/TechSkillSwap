import { Router } from 'express';
import { SkillCategoryController } from '../controllers/SkillCategoryController';

const router = Router();

// Crear una nueva categoría de habilidades
router.post('/', SkillCategoryController.create);

// Listar todas las categorías de habilidades con paginación
router.get('/', SkillCategoryController.findAll);

// Obtener una categoría de habilidades por ID
router.get('/:id', SkillCategoryController.findById);

// Actualizar una categoría de habilidades por ID
router.put('/:id', SkillCategoryController.update);

// Eliminar una categoría de habilidades por ID
router.delete('/:id', SkillCategoryController.delete);

export default router;
