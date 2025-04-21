import { Router } from 'express';
import { SeedController } from '../controllers/SeederController';

const router = Router();

// Instancia del controlador de seeding
const seedController = new SeedController();

// Ruta para iniciar el proceso de seeding
router.post('/seed', (req, res) => seedController.runSeed(req, res));

export default router;
