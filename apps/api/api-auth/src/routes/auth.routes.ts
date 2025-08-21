import rateLimit from 'express-rate-limit';
import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { register, login, verifyToken, protectedRoute } from '../controllers/AuthController';
import { UserRegistrationSchema, UserLoginSchema } from '@shared-types';

// Rate limiter for protected routes
const protectedRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const router = express.Router();

router.post('/register', validateData(UserRegistrationSchema), register);
router.post('/login', validateData(UserLoginSchema), login);
router.get('/protected', protectedRouteLimiter, verifyToken, protectedRoute);

export default router;