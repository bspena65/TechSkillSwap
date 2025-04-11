import { Router } from 'express';
import { LanguageController } from '../controllers/LanguageController';

const router = Router();

// Rutas correspondientes a cada operación de Language
router.post('/', LanguageController.create); // Crear un nuevo language
router.put('/:id', LanguageController.update); // Actualizar un language
router.delete('/:id', LanguageController.delete); // Eliminar un language
router.get('/getById/:id', LanguageController.getById); // Obtener un language por ID
router.get('/search', LanguageController.search); // Búsqueda general
router.get('/list/:page', LanguageController.findAll); // Listar languages con paginación, 50 por página
router.get('/getall', LanguageController.findAllList); // Listar languages con paginación, 50 por página

export default router;
