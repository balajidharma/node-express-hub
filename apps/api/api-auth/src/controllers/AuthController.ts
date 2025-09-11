import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import { PrismaClient } from '@prisma/client/mongodb-app/client.js';

import { UserRegistration, UserLogin1 } from '@shared-types';

// Extend the Express Request interface
interface TypedRequestBody<T> extends Request {
  body: T;
}

const prisma = new PrismaClient();

const generateToken = (userId: string) => {
  const expiresIn = process.env.JWT_TTL || '1h'; // Default to 1 hour if not set

  const expiresInMs = typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn;

  // Check if the conversion was successful. ms() returns undefined for invalid input.
  if (!expiresInMs) {
    throw new Error(
      'Invalid JWT_TTL value provided. Please use a valid format (e.g., "1h", "30d", or a number in ms).'
    );
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn,
  });

  const expiresAt = Date.now() + expiresInMs;

  return { token, expiresAt };
};

export const register = async (
  req: TypedRequestBody<UserRegistration>,
  res: Response
) => {
  const { email, username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, name },
  });
  const { token, expiresAt } = generateToken(user.id);
  res.status(201).json({ token, expiresAt });
};

export const login = async (
  req: TypedRequestBody<UserLogin1>,
  res: Response
) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({
        errors: {
          username: { message: 'These credentials do not match our records.' },
        },
      });
  }

  const { token, expiresAt } = generateToken(user.id);
  res.status(201).json({ token, expiresAt });
};

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body.user = user;
    next();
  });
};

export const protectedRoute = (req: Request, res: Response) => {
  res.json({ message: 'Protected route accessed', user: req.body.user });
};
