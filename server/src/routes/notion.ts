import express from 'express';
import { authenticate } from '../middleware/auth';
import { NotionSyncService } from '../services/notionSyncService';
import { db } from '../db/database';

const router = express.Router();

/**
 * Configure or update Notion Sync settings for a user
 * In a real app, these keys should be encrypted in the DB.
 */
router.post('/config', authenticate, (req, res) => {
  const { apiKey, databaseId } = req.body;
  const userId = (req as any).user.id;

  try {
    // Store in a simple key-value settings table, or user preferences.
    // For this prototype, we'll use the existing setting table structure.
    const stmt = db.prepare(`
      INSERT INTO settings (user_id, key, value) 
      VALUES (?, 'notion_api_key', ?) 
      ON CONFLICT(user_id, key) DO UPDATE SET value=excluded.value
    `);
    stmt.run(userId, apiKey);

    const stmt2 = db.prepare(`
      INSERT INTO settings (user_id, key, value) 
      VALUES (?, 'notion_database_id', ?) 
      ON CONFLICT(user_id, key) DO UPDATE SET value=excluded.value
    `);
    stmt2.run(userId, databaseId);

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving Notion config:', err);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

router.get('/config', authenticate, (req, res) => {
  const userId = (req as any).user.id;
  try {
    const apiRow = db.prepare(`SELECT value FROM settings WHERE user_id = ? AND key = 'notion_api_key'`).get(userId) as any;
    const dbRow = db.prepare(`SELECT value FROM settings WHERE user_id = ? AND key = 'notion_database_id'`).get(userId) as any;
    
    res.json({
      apiKey: apiRow ? apiRow.value : '',
      databaseId: dbRow ? dbRow.value : ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve config' });
  }
});

router.post('/sync/:tripId', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { tripId } = req.params;

  try {
    const apiRow = db.prepare(`SELECT value FROM settings WHERE user_id = ? AND key = 'notion_api_key'`).get(userId) as any;
    const dbRow = db.prepare(`SELECT value FROM settings WHERE user_id = ? AND key = 'notion_database_id'`).get(userId) as any;

    if (!apiRow?.value || !dbRow?.value) {
      return res.status(400).json({ error: 'Notion configuration is missing.' });
    }

    const notionService = new NotionSyncService({
      apiKey: apiRow.value,
      databaseId: dbRow.value
    });

    // Verify first
    const isValid = await notionService.verifyConnection();
    if (!isValid) {
      return res.status(401).json({ error: 'Failed to connect to Notion. Please check your Integration Token and Database ID.' });
    }

    const result = await notionService.exportTrip(Number(tripId));
    if (result.success) {
      res.json({ success: true, message: \`Successfully synced \${result.syncedCount} places to Notion.\` });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (err: any) {
    console.error('Sync Error:', err);
    res.status(500).json({ error: err.message || 'Server error during sync' });
  }
});

export default router;
