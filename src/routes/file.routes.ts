import { Router } from 'express';
import {
    uploadFile,
    listFiles,
    deleteFile,
    getFile,
    downloadFile,
    updateFile
} from '../controllers/file.controller';

const router = Router();

router.post('/upload', uploadFile);
router.get('/list', listFiles);
router.delete('/delete/:id', deleteFile);
router.get('/:id', getFile);
router.get('/download/:id', downloadFile);
router.put('/update/:id', updateFile);

export const fileRouter = router;
