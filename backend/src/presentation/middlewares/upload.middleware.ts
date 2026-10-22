import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { BadRequestError } from '../../core/errors/app-error';

// Ensure upload folders exist
const baseUploadDir = path.resolve(process.cwd(), 'uploads');
const treeUploadDir = path.resolve(baseUploadDir, 'trees');
const experienceUploadDir = path.resolve(baseUploadDir, 'experiences');
const visitUploadDir = path.resolve(baseUploadDir, 'visits');

[baseUploadDir, treeUploadDir, experienceUploadDir, visitUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generic storage engine that routes files into subfolders based on route or fieldname
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    let targetDir = treeUploadDir;
    if (req.originalUrl.includes('experience') || file.fieldname.includes('experience')) {
      targetDir = experienceUploadDir;
    } else if (req.originalUrl.includes('visit') || file.fieldname.includes('visit') || file.fieldname.includes('memory')) {
      targetDir = visitUploadDir;
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `planton-${base}-${uniqueSuffix}${ext}`);
  },
});

// File filter restricting uploads to standard image formats
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.'));
  }
};

export const treeImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const multiImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB per file
    files: 10, // Up to 10 files at once
  },
});

