import { AppDataSource } from '../config/ormconfig';
import { User } from '../models/user.model';
import { UserRefreshToken } from '../models/userRefreshToken.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);
const tokenRepo = AppDataSource.getRepository(UserRefreshToken);

export class AuthService {
    static async signIn(login: string, password: string) {
        const user = await userRepo.findOneBy({ login });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { status: 401, data: { message: 'Invalid credentials' } };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });
        const refresh = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });

        const refreshTokenEntity = tokenRepo.create({ userId: user.id, token: refresh });
        await tokenRepo.save(refreshTokenEntity);

        return { status: 200, data: { token, refresh } };
    }

    static async signUp(login: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const user = userRepo.create({ login, password: hashed });
        await userRepo.save(user);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });
        const refresh = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });

        const refreshTokenEntity = tokenRepo.create({ userId: user.id, token: refresh });
        await tokenRepo.save(refreshTokenEntity);

        return { status: 201, data: { token, refresh } };
    }

    static async refreshToken(token: string) {
        try {
            const payload = jwt.verify(token, process.env.REFRESH_SECRET!) as any;

            const tokenEntity = await tokenRepo.findOneBy({ token });
            if (!tokenEntity) {
                return { status: 403, data: { message: 'Invalid refresh token' } };
            }

            const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });
            return { status: 200, data: { token: newToken } };
        } catch (err) {
            return { status: 403, data: { message: 'Refresh token expired or invalid' } };
        }
    }

    static async logout(userId: number, refreshToken: string) {
        await tokenRepo.delete({ userId, token: refreshToken });
        return { status: 200, data: { message: 'Logged out successfully' } };
    }
}
