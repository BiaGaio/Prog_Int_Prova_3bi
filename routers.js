import express from 'express';
import {
  getDados,
  getDadoId,
  criaDado,
  atualizaDado,
  deletaDado,
  login,
} from './controllers/usersController.js';
import { authenticateToken } from './middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/',authenticateToken, getDados);
router.get('/:id',authenticateToken, getDadoId);
router.post('/', criaDado);
router.put('/:id', authenticateToken, atualizaDado);
router.delete('/:id', authenticateToken, deletaDado);

export { router };
