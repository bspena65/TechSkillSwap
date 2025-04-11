import { Router } from 'express';
import { AdminController } from '../controllers/AdminControllet';

const router = Router();

// Crear una nueva solicitud de conexión
router.get('/deleleAllDataRequest/', AdminController.deleteRequestMessageChats);

export default router;
