import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/admin/uploads/images - Upload multiple image files
router.post('/images', authenticateAdmin, (req, res): any => {
  upload.array('images', 10)(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed.'
      });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    return res.json({
      success: true,
      message: `${files.length} image(s) uploaded successfully`,
      imageUrls
    });
  });
});

export default router;
