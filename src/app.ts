import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { fileRouter } from './routes/file.routes';
import { verifyToken } from './middlewares/auth.middleware';
import 'reflect-metadata';
import path from "path";


dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/file', verifyToken, fileRouter);
app.use('/auth', authRouter);



export default app;
