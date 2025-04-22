import { Request, Response } from 'express';
import { FileService } from '../services/file.service';

export const uploadFile = async (req: Request, res: Response) => {
    const result = await FileService.upload(req);
    res.status(result.status).json(result.data);
};

export const listFiles = async (req: Request, res: Response) => {
    const result = await FileService.list(req);
    res.status(result.status).json(result.data);
};

export const deleteFile = async (req: Request, res: Response) => {
    const result = await FileService.remove(req.params.id);
    res.status(result.status).json(result.data);
};

export const getFile = async (req: Request, res: Response) => {
    const result = await FileService.get(req.params.id);
    res.status(result.status).json(result.data);
};

export const downloadFile = async (req: Request, res: Response) => {
    const result = await FileService.download(req, res);
};

export const updateFile = async (req: Request, res: Response) => {
    const result = await FileService.update(req);
    res.status(result.status).json(result.data);
};
