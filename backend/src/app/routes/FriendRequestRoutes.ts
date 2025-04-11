import { Router } from 'express';
import { FriendRequestController } from '../controllers/FriendRequestsController';

const router = Router();

// Crear una nueva solicitud de conexión
router.post('/', FriendRequestController.create);

// Listar todas las solicitudes de conexión con paginación
router.get('/', FriendRequestController.findAll);

// Obtener una solicitud de conexión por ID
router.get('/getbyid/:id', FriendRequestController.findById);

// Actualizar una solicitud de conexión por ID
router.put('/:id', FriendRequestController.update);

// Eliminar una solicitud de conexión por ID
router.delete('/:id', FriendRequestController.delete);

// Ruta opcional para obtener todas las solicitudes sin paginación (si necesitas)
router.get('/getall', FriendRequestController.findAllList);

// Ruta para obtener todas las solicitudes de conexión por receiverId con paginación
router.get('/receiver/:receiverId', FriendRequestController.getByReceiverId);

// Mis solicitudes de conexion enviadas
router.get('/sender/:senderId', FriendRequestController.getBySenderId);


export default router;
