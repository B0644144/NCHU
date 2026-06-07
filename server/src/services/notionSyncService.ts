import { Client } from '@notionhq/client';
import { db } from '../db/database';
import { Place, Trip, Day } from '../types';

export interface NotionSyncConfig {
  apiKey: string;
  databaseId: string;
}

/**
 * Service to handle exporting Trip Data to a Notion Database.
 * Requires the Notion Integration to have access to the Target Database.
 */
export class NotionSyncService {
  private notion: Client;
  private databaseId: string;

  constructor(config: NotionSyncConfig) {
    this.notion = new Client({ auth: config.apiKey });
    this.databaseId = config.databaseId;
  }

  /**
   * Syncs a single trip's itinerary (Days and Places) to the specified Notion database.
   * This implementation creates new pages for each place in the trip.
   * In a robust implementation, this would track Notion Page IDs in the local DB for 2-way sync.
   */
  async exportTrip(tripId: number): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    try {
      // 1. Fetch Trip Data
      const trip = db.prepare('SELECT title, start_date, end_date FROM trips WHERE id = ?').get(tripId) as Pick<Trip, 'title'|'start_date'|'end_date'>;
      if (!trip) throw new Error('Trip not found');

      // 2. Fetch Places assigned to days
      const query = `
        SELECT p.name, p.description, p.address, p.place_time, d.date as day_date
        FROM places p
        JOIN day_assignments da ON p.id = da.place_id
        JOIN days d ON da.day_id = d.id
        WHERE p.trip_id = ?
        ORDER BY d.date, da.order_index
      `;
      const places = db.prepare(query).all(tripId) as any[];

      let syncedCount = 0;

      // 3. Create pages in Notion Database for each place
      for (const place of places) {
        await this.notion.pages.create({
          parent: { database_id: this.databaseId },
          properties: {
            // "Name" is a standard Title property in Notion DBs
            'Name': {
              title: [
                {
                  text: { content: place.name || 'Unnamed Place' }
                }
              ]
            },
            // Custom properties that the user must have in their Notion DB:
            'Trip': {
              rich_text: [
                { text: { content: trip.title || 'Untitled Trip' } }
              ]
            },
            'Date': {
              date: { start: place.day_date || new Date().toISOString().split('T')[0] }
            },
            'Address': {
              rich_text: [
                { text: { content: place.address || '' } }
              ]
            }
          }
        });
        syncedCount++;
      }

      return { success: true, syncedCount };
    } catch (error: any) {
      console.error('Notion Sync Error:', error);
      return { success: false, syncedCount: 0, error: error.message || 'Unknown Notion sync error' };
    }
  }

  /**
   * Simple test to verify the token and database access.
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.notion.databases.retrieve({ database_id: this.databaseId });
      return true;
    } catch (e) {
      console.error('Notion connection failed:', e);
      return false;
    }
  }
}
