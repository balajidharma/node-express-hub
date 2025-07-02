import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client/mongodb-app/client.js';

const prisma = new PrismaClient();

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const register = async (req: Request, res: Response) => {
    const { email, username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, name },
    });
    const token = generateToken(user.id);
    res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token });
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