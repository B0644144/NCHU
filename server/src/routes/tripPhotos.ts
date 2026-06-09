import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, demoUploadBlock } from '../middleware/auth';
import { requireTripAccess } from '../middleware/tripAccess';
import { checkPermission } from '../services/permissions';
import { AuthRequest } from '../types';
import { db } from '../db/database';

const router = express.Router({ mergeParams: true });

const photosDir = path.join(__dirname, '../../uploads/photos');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }
    cb(null, photosDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      const err: Error & { statusCode?: number } = new Error('Only image files (jpg, jpeg, png, gif, webp, heic) are allowed');
      err.statusCode = 400;
      cb(err);
    }
  },
});

// GET /
router.get('/', authenticate, requireTripAccess, (req: Request, res: Response) => {
  const { tripId } = req.params;

  const rows = db.prepare('SELECT * FROM photos WHERE trip_id = ? ORDER BY created_at DESC').all(tripId) as any[];

  const mapped = rows.map(photo => ({
    id: photo.id,
    trip_id: photo.trip_id,
    day_id: photo.day_id,
    place_id: photo.place_id,
    filename: photo.filename,
    original_name: photo.original_name,
    size: photo.file_size,
    mime_type: photo.mime_type,
    caption: photo.caption,
    taken_at: photo.taken_at,
    created_at: photo.created_at,
    url: `/uploads/photos/${photo.filename}`,
  }));

  res.json({ photos: mapped });
});

// POST /
router.post('/', authenticate, requireTripAccess, demoUploadBlock, upload.single('file'), (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { tripId } = req.params;
  const { user_id: tripOwnerId } = authReq.trip!;

  if (!checkPermission('file_upload', authReq.user.role, tripOwnerId, authReq.user.id, tripOwnerId !== authReq.user.id)) {
    return res.status(403).json({ error: 'No permission to upload files' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { day_id, place_id, caption, taken_at } = req.body;

  const stmt = db.prepare(`
    INSERT INTO photos (trip_id, day_id, place_id, filename, original_name, file_size, mime_type, caption, taken_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    Number(tripId),
    day_id ? Number(day_id) : null,
    place_id ? Number(place_id) : null,
    req.file.filename,
    req.file.originalname,
    req.file.size,
    req.file.mimetype,
    caption || null,
    taken_at || null
  );

  const newPhotoId = result.lastInsertRowid;
  const newPhoto = db.prepare('SELECT * FROM photos WHERE id = ?').get(newPhotoId) as any;

  const mapped = {
    id: newPhoto.id,
    trip_id: newPhoto.trip_id,
    day_id: newPhoto.day_id,
    place_id: newPhoto.place_id,
    filename: newPhoto.filename,
    original_name: newPhoto.original_name,
    size: newPhoto.file_size,
    mime_type: newPhoto.mime_type,
    caption: newPhoto.caption,
    taken_at: newPhoto.taken_at,
    created_at: newPhoto.created_at,
    url: `/uploads/photos/${newPhoto.filename}`,
  };

  res.status(201).json({ photos: [mapped] });
});

// PUT /:id
router.put('/:id', authenticate, requireTripAccess, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { tripId, id } = req.params;
  const { user_id: tripOwnerId } = authReq.trip!;

  if (!checkPermission('file_edit', authReq.user.role, tripOwnerId, authReq.user.id, tripOwnerId !== authReq.user.id)) {
    return res.status(403).json({ error: 'No permission to edit files' });
  }

  const { day_id, place_id, caption, taken_at } = req.body;

  const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND trip_id = ?').get(id, tripId) as any;
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  const stmt = db.prepare(`
    UPDATE photos
    SET day_id = ?, place_id = ?, caption = ?, taken_at = ?
    WHERE id = ? AND trip_id = ?
  `);
  stmt.run(
    day_id !== undefined ? (day_id ? Number(day_id) : null) : photo.day_id,
    place_id !== undefined ? (place_id ? Number(place_id) : null) : photo.place_id,
    caption !== undefined ? (caption || null) : photo.caption,
    taken_at !== undefined ? (taken_at || null) : photo.taken_at,
    id,
    tripId
  );

  const updatedPhoto = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as any;
  const mapped = {
    id: updatedPhoto.id,
    trip_id: updatedPhoto.trip_id,
    day_id: updatedPhoto.day_id,
    place_id: updatedPhoto.place_id,
    filename: updatedPhoto.filename,
    original_name: updatedPhoto.original_name,
    size: updatedPhoto.file_size,
    mime_type: updatedPhoto.mime_type,
    caption: updatedPhoto.caption,
    taken_at: updatedPhoto.taken_at,
    created_at: updatedPhoto.created_at,
    url: `/uploads/photos/${updatedPhoto.filename}`,
  };

  res.json({ photo: mapped });
});

// DELETE /:id
router.delete('/:id', authenticate, requireTripAccess, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { tripId, id } = req.params;
  const { user_id: tripOwnerId } = authReq.trip!;

  if (!checkPermission('file_delete', authReq.user.role, tripOwnerId, authReq.user.id, tripOwnerId !== authReq.user.id)) {
    return res.status(403).json({ error: 'No permission to delete files' });
  }

  const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND trip_id = ?').get(id, tripId) as any;
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  db.prepare('DELETE FROM photos WHERE id = ? AND trip_id = ?').run(id, tripId);

  const filePath = path.join(photosDir, photo.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete physical photo file:', err);
    }
  }

  res.json({ success: true });
});

export default router;
