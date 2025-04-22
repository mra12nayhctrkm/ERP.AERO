import { Router } from 'express';
import {
    signin,
    signup,
    getInfo,
    logout,
    refreshToken
} from '../controllers/auth.controller';
import {verifyToken} from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/new_token', refreshToken);

// Protected routes
router.get('/info', verifyToken, getInfo);
router.get('/logout', verifyToken, logout);


export const authRouter = router;
