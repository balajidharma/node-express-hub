import express from 'express';
import { register, login, verifyToken, protectedRoute } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', verifyToken, protectedRoute);

export default router;