import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { register, login, verifyToken, protectedRoute } from '../controllers/authController';
import { userRegistrationSchema, userLoginSchema } from '../schemas/userSchemas';

const router = express.Router();

router.post('/register', validateData(userRegistrationSchema), register);
router.post('/login', validateData(userLoginSchema), login);
router.get('/protected', verifyToken, protectedRoute);

export default router;