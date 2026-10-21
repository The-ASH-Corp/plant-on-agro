import { Router, Request, Response, NextFunction } from 'express';
import { treeImageUpload } from '../middlewares/upload.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';

const router = Router();

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

      // Generate the relative web path
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

export const uploadRoutes = router;
