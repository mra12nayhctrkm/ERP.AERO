import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {isBlacklisted} from "./tokenBlacklist";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token has been revoked' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = decoded;
        (req as any).token = token; // Save token for later use if needed
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token is invalid or expired' });
    }
};
