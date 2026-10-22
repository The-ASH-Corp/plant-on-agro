import { Router, Request, Response, NextFunction } from 'express';
import { treeImageUpload, multiImageUpload } from '../middlewares/upload.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';

const router = Router();

// Helper to determine destination path
function getDestinationPath(reqUrl: string, filename: string): string {
  if (reqUrl.includes('experience')) {
    return `/uploads/experiences/${filename}`;
  }
  if (reqUrl.includes('visit') || reqUrl.includes('memory')) {
    return `/uploads/visits/${filename}`;
  }
  return `/uploads/trees/${filename}`;
}

// POST /api/v1/upload/tree-image - Upload a single tree image using multer
router.post(
  '/tree-image',
  authenticate,
  authorize('admin'),
  treeImageUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        ApiResponse.error(res, 'No image file uploaded', HttpStatus.BAD_REQUEST);
        return;
      }

      const imageUrl = `/uploads/trees/${req.file.filename}`;

      ApiResponse.created(
        res,
        {
          imageUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        'Tree image uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/upload/multiple - Upload multiple images (up to 10 files)
router.post(
  '/multiple',
  authenticate,
  multiImageUpload.array('images', 10),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        ApiResponse.error(res, 'No image files uploaded', HttpStatus.BAD_REQUEST);
        return;
      }

      const uploaded = files.map((file) => ({
        imageUrl: getDestinationPath(req.originalUrl, file.filename),
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));

      ApiResponse.created(
        res,
        {
          files: uploaded,
          urls: uploaded.map((u) => u.imageUrl),
          count: uploaded.length,
        },
        `${uploaded.length} images uploaded successfully`
      );
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/upload/experience-images - Upload images specifically for experience galleries (Admin)
router.post(
  '/experience-images',
  authenticate,
  authorize('admin'),
  multiImageUpload.array('images', 10),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        ApiResponse.error(res, 'No images uploaded for experience gallery', HttpStatus.BAD_REQUEST);
        return;
      }

      const uploaded = files.map((file) => ({
        imageUrl: `/uploads/experiences/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));

      ApiResponse.created(
        res,
        {
          files: uploaded,
          urls: uploaded.map((u) => u.imageUrl),
          count: uploaded.length,
        },
        `${uploaded.length} experience gallery images uploaded successfully`
      );
    } catch (error) {
      next(error);
    }
  }
);

export const uploadRoutes = router;

