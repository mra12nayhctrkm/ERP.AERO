import { DataSource } from 'typeorm';
import { User } from '../models/user.model';
import { File } from '../models/file.model';
import {UserRefreshToken} from "../models/userRefreshToken.model";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_aero',
    entities: [User, File, UserRefreshToken],
    synchronize: true,
});
