import { Router } from 'express';
import { UserLanguageController } from '../controllers/UserLanguageController';

const router = Router();

// Guardar o actualizar un userLanguage
router.post('/', UserLanguageController.save);

// Listar todos los idiomas del usuario con paginación
router.get('/', UserLanguageController.findAll);

// Obtener un idioma del usuario por ID
router.get('/:id', UserLanguageController.findById);

// Actualizar un idioma del usuario por ID
router.put('/:id', UserLanguageController.update);

// Eliminar un idioma del usuario por ID
router.delete('/:id', UserLanguageController.delete);

export default router;
