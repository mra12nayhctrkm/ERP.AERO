import { AppDataSource } from '../config/ormconfig';
import { File } from '../models/file.model';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const fileRepo = AppDataSource.getRepository(File);
const uploadDir = path.resolve('uploads');

export class FileService {
    static async upload(req: Request) {
        if (!req.files || !req.files.file) {
            return { status: 400, data: { message: 'No file uploaded' } };
        }
        const uploaded = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const filepath = path.join(uploadDir, uploaded.name);
        await uploaded.mv(filepath);

        const fileData = fileRepo.create({
            filename: uploaded.name,
            mimetype: uploaded.mimetype,
            size: uploaded.size,
            extension: path.extname(uploaded.name).slice(1)
        });
        await fileRepo.save(fileData);

        return { status: 201, data: { message: 'File uploaded successfully' } };
    }

    static async list(req: Request) {
        const listSize = Number(req.query.list_size) || 10;
        const page = Number(req.query.page) || 1;
        const [files, count] = await fileRepo.findAndCount({
            skip: (page - 1) * listSize,
            take: listSize
        });
        return { status: 200, data: { files, count } };
    }

    static async remove(id: string) {
        const file = await fileRepo.findOneBy({ id: Number(id) });
        if (!file) return { status: 404, data: { message: 'File not found' } };

        const filepath = path.join(uploadDir, file.filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        await fileRepo.remove(file);
        return { status: 200, data: { message: 'File deleted' } };
    }

    static async get(id: string) {
        const file = await fileRepo.findOneBy({ id: Number(id) });
        if (!file) return { status: 404, data: { message: 'File not found' } };
        return { status: 200, data: file };
    }

    static async download(req: Request, res: Response) {
        const file = await fileRepo.findOneBy({ id: Number(req.params.id) });
        if (!file) return res.status(404).json({ message: 'File not found' });

        const filepath = path.join(uploadDir, file.filename);
        if (!fs.existsSync(filepath)) return res.status(404).json({ message: 'File not on disk' });

        res.download(filepath);
    }

    static async update(req: Request) {
        if (!req.files || !req.files.file) {
            return { status: 400, data: { message: 'No file uploaded' } };
        }
        const uploaded = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const existing = await fileRepo.findOneBy({ id: Number(req.params.id) });
        if (!existing) return { status: 404, data: { message: 'File not found' } };

        const oldPath = path.join(uploadDir, existing.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

        const newPath = path.join(uploadDir, uploaded.name);
        await uploaded.mv(newPath);

        existing.filename = uploaded.name;
        existing.mimetype = uploaded.mimetype;
        existing.size = uploaded.size;
        existing.extension = path.extname(uploaded.name).slice(1);
        await fileRepo.save(existing);

        return { status: 200, data: { message: 'File updated successfully' } };
    }
}
