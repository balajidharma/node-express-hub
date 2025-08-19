import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { register, login, verifyToken, protectedRoute } from '../controllers/authController';
import { UserRegistrationSchema, UserLoginSchema } from '@shared-types';

const router = express.Router();

router.post('/register', validateData(UserRegistrationSchema), register);
router.post('/login', validateData(UserLoginSchema), login);
router.get('/protected', verifyToken, protectedRoute);

export default router;