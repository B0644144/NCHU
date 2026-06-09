/**
 * Trip Photos integration tests.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import path from 'path';
import fs from 'fs';

const { testDb, dbMock } = vi.hoisted(() => {
  const Database = require('better-sqlite3');
  const db = new Database(':memory:');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');
  const mock = {
    db,
    closeDb: () => {},
    reinitialize: () => {},
    getPlaceWithTags: () => null,
    canAccessTrip: (tripId: any, userId: number) =>
      db.prepare(`SELECT t.id, t.user_id FROM trips t LEFT JOIN trip_members m ON m.trip_id = t.id AND m.user_id = ? WHERE t.id = ? AND (t.user_id = ? OR m.user_id IS NOT NULL)`).get(userId, tripId, userId),
    isOwner: (tripId: any, userId: number) =>
      !!db.prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?').get(tripId, userId),
  };
  return { testDb: db, dbMock: mock };
});

vi.mock('../../src/db/database', () => dbMock);
vi.mock('../../src/config', () => ({
  JWT_SECRET: 'test-jwt-secret-for-trek-testing-only',
  ENCRYPTION_KEY: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2',
  updateJwtSecret: () => {},
}));

import { createApp } from '../../src/app';
import { createTables } from '../../src/db/schema';
import { runMigrations } from '../../src/db/migrations';
import { resetTestDb } from '../helpers/test-db';
import { createUser, createTrip, addTripMember } from '../helpers/factories';
import { authCookie } from '../helpers/auth';
import { loginAttempts, mfaAttempts } from '../../src/routes/auth';

const app: Application = createApp();
const FIXTURE_IMG = path.join(__dirname, '../fixtures/small-image.jpg');
const photosDir = path.join(__dirname, '../../uploads/photos');

beforeAll(() => {
  createTables(testDb);
  runMigrations(testDb);
  if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });
});

beforeEach(() => {
  resetTestDb(testDb);
  loginAttempts.clear();
  mfaAttempts.clear();
});

afterAll(() => {
  testDb.close();
  // clean up photos Dir
  if (fs.existsSync(photosDir)) {
    fs.rmSync(photosDir, { recursive: true, force: true });
  }
});

describe('Trip Photos API', () => {
  it('GET /api/trips/:tripId/photos - returns empty array initially', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);

    const res = await request(app)
      .get(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id));
    expect(res.status).toBe(200);
    expect(res.body.photos).toEqual([]);
  });

  it('POST /api/trips/:tripId/photos - uploads a photo successfully', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);

    const res = await request(app)
      .post(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id))
      .attach('file', FIXTURE_IMG)
      .field('caption', 'Sunny beach')
      .field('taken_at', '2026-06-07T12:00:00Z');

    expect(res.status).toBe(201);
    expect(res.body.photos).toBeDefined();
    expect(res.body.photos.length).toBe(1);
    const photo = res.body.photos[0];
    expect(photo.caption).toBe('Sunny beach');
    expect(photo.taken_at).toBe('2026-06-07T12:00:00Z');
    expect(photo.url).toBe(`/uploads/photos/${photo.filename}`);
    expect(photo.size).toBeGreaterThan(0);

    // Verify it exists in filesystem
    const filePath = path.join(photosDir, photo.filename);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('GET /api/trips/:tripId/photos - returns uploaded photos', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);

    await request(app)
      .post(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id))
      .attach('file', FIXTURE_IMG)
      .field('caption', 'Sunny beach');

    const res = await request(app)
      .get(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id));
    expect(res.status).toBe(200);
    expect(res.body.photos.length).toBe(1);
    expect(res.body.photos[0].caption).toBe('Sunny beach');
  });

  it('PUT /api/trips/:tripId/photos/:id - updates metadata successfully', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);

    const uploadRes = await request(app)
      .post(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id))
      .attach('file', FIXTURE_IMG)
      .field('caption', 'Old caption');

    const photoId = uploadRes.body.photos[0].id;

    const res = await request(app)
      .put(`/api/trips/${trip.id}/photos/${photoId}`)
      .set('Cookie', authCookie(user.id))
      .send({ caption: 'Updated caption', taken_at: '2026-06-07T15:00:00Z' });

    expect(res.status).toBe(200);
    expect(res.body.photo.caption).toBe('Updated caption');
    expect(res.body.photo.taken_at).toBe('2026-06-07T15:00:00Z');
  });

  it('DELETE /api/trips/:tripId/photos/:id - deletes physical file and record', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);

    const uploadRes = await request(app)
      .post(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id))
      .attach('file', FIXTURE_IMG);

    const photo = uploadRes.body.photos[0];
    const filePath = path.join(photosDir, photo.filename);
    expect(fs.existsSync(filePath)).toBe(true);

    const delRes = await request(app)
      .delete(`/api/trips/${trip.id}/photos/${photo.id}`)
      .set('Cookie', authCookie(user.id));

    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    // Verify filesystem cleanup
    expect(fs.existsSync(filePath)).toBe(false);

    // Verify DB empty
    const listRes = await request(app)
      .get(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(user.id));
    expect(listRes.body.photos).toEqual([]);
  });

  it('Access control - non-member is blocked', async () => {
    const { user: owner } = createUser(testDb);
    const { user: other } = createUser(testDb);
    const trip = createTrip(testDb, owner.id);

    // POST
    const postRes = await request(app)
      .post(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(other.id))
      .attach('file', FIXTURE_IMG);
    expect(postRes.status).toBe(404); // requireTripAccess returns 404

    // GET
    const getRes = await request(app)
      .get(`/api/trips/${trip.id}/photos`)
      .set('Cookie', authCookie(other.id));
    expect(getRes.status).toBe(404);
  });

  it('Demo mode - block upload', async () => {
    const { user } = createUser(testDb, { email: 'demo@nomad.app' });
    const trip = createTrip(testDb, user.id);
    process.env.DEMO_MODE = 'true';

    try {
      const res = await request(app)
        .post(`/api/trips/${trip.id}/photos`)
        .set('Cookie', authCookie(user.id))
        .attach('file', FIXTURE_IMG);
      expect(res.status).toBe(403);
    } finally {
      delete process.env.DEMO_MODE;
    }
  });
});
