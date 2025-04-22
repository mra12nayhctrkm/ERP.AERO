import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {addToBlacklist} from "../middlewares/tokenBlacklist";

export const signin = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    const result = await AuthService.signIn(login, password);
    res.status(result.status).json(result.data);
};

export const signup = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    const result = await AuthService.signUp(login, password);
    res.status(result.status).json(result.data);
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.status(result.status).json(result.data);
};

export const getInfo = async (req: Request, res: Response) => {
    res.json({ userId: req.user.id });
};

export const logout = async (req: Request, res: Response) => {
    const accessToken = (req.headers.authorization || '').split(' ')[1];
    const refreshTokenRaw = req.query.refreshToken;

    if (!accessToken || typeof refreshTokenRaw !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid tokens' });
    }

    const refreshToken = refreshTokenRaw;
    const userId = req.user.id;
    const result = await AuthService.logout(userId, refreshToken);

    addToBlacklist(accessToken);
    res.status(result.status).json(result.data);
};

