import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { upload } from '../../shared/middlewares/multerImages';

const router = Router();

// Rutas correspondientes a cada operación de User
router.post('/create', UserController.create);
router.put('/update/:id', UserController.update);
router.delete('/delete/:id', UserController.delete);
router.get('/search', UserController.searchAdvanced); // Búsqueda avanzada
router.get('/getById/:id', UserController.getById); // Buscar por ID
router.get('/getByIdAndSender/:id', UserController.getByIdAndSender); // Buscar por ID
router.get('/searchByJustWordAllData', UserController.searchByJustWordAllData); // Búsqueda por palabra en todos los campos
router.put('/updateBio/:id', UserController.updateBio);
router.put(
  '/updateNameLabelLocation/:id',
  UserController.updateNameLabelLocation,
);
router.put(
  '/updateImagenProfile/:id',
  upload.single('profilePicture'),
  UserController.updateProfilePictureUrl,
);

export default router;
