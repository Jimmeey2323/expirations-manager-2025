import axios from 'axios';
import { GOOGLE_CONFIG, SPREADSHEET_ID, EXPIRATIONS_SHEET, NOTES_SHEET, SHEETS_API_BASE } from '../config/google';
import { Expiration, ExpirationNote } from '../types';

class GoogleSheetsService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Get a valid access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(GOOGLE_CONFIG.TOKEN_URL, {
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        client_secret: GOOGLE_CONFIG.CLIENT_SECRET,
        refresh_token: GOOGLE_CONFIG.REFRESH_TOKEN,
        grant_type: 'refresh_token',
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000; // 5 min buffer
      
      if (!this.accessToken) {
        throw new Error('Failed to obtain access token');
      }
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw new Error('Authentication failed');
    }
  }

  // Fetch expirations from the Expirations sheet (new format)
  async fetchExpirations(): Promise<Expiration[]> {
    const token = await this.getAccessToken();
    // Columns A:R (18 columns - includes Revenue and Assigned Associate)
    const range = `${EXPIRATIONS_SHEET}!A:R`;

    try {
      const response = await axios.get(
        `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // Skip header row (first row contains headers)
      const dataRows = rows.slice(1);

      return dataRows.map((row: string[]) => ({
        uniqueId: row[0] || '',
        memberId: row[1] || '',
        firstName: row[2] || '',
        lastName: row[3] || '',
        email: row[4] || '',
        membershipName: row[5] || '',
        endDate: row[6] || '',
        homeLocation: row[7] || '',
        currentUsage: row[8] || '',
        id: row[9] || '',
        orderAt: row[10] || '',
        soldBy: row[11] || '',
        membershipId: row[12] || '',
        frozen: row[13] || '',
        paid: row[14] || '',
        status: row[15] || '',
        revenue: row[16] || '',
        assignedAssociate: row[17] || '',
      }));
    } catch (error) {
      console.error('Failed to fetch expirations:', error);
      throw error;
    }
  }

  // Fetch notes from the Notes sheet
  async fetchNotes(): Promise<ExpirationNote[]> {
    const token = await this.getAccessToken();
    const range = `${NOTES_SHEET}!A:Z`; // Get all columns

    try {
      const response = await axios.get(
        `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // First row contains headers
      const headers = rows[0];
      const dataRows = rows.slice(1);

      return dataRows
        .filter((row: string[]) => {
          // Filter out completely empty rows or rows with empty expirationId (first column)
          return row.length > 0 && row[0] && row[0].trim() !== '';
        })
        .map((row: string[]) => {
          const note: any = {};
          headers.forEach((header: string, index: number) => {
            const value = row[index] || '';
            
            // Parse specific fields
            if (header === 'tags' && value) {
              note[header] = value.split(',').map((t: string) => t.trim());
            } else if (header === 'followUps' && value) {
              try {
                note[header] = JSON.parse(value);
              } catch {
                note[header] = [];
              }
            } else if (header === 'customFields' && value) {
              try {
                note[header] = JSON.parse(value);
              } catch {
                note[header] = {};
              }
            } else {
              note[header] = value;
            }
          });
          return note as ExpirationNote;
        });
    } catch (error) {
      // If Notes sheet doesn't exist or is empty, return empty array
      console.warn('Notes sheet not found or empty:', error);
      return [];
    }
  }

  // Save or update a note in the Notes sheet
  async saveNote(note: ExpirationNote): Promise<void> {
    const token = await this.getAccessToken();
    
    try {
      // First, fetch existing notes to find the row
      const existingNotes = await this.fetchNotes();
      const existingIndex = existingNotes.findIndex(n => n.expirationId === note.expirationId);

      // Prepare the note data
      const noteData = {
        expirationId: note.expirationId,
        associateName: note.associateName || '',
        stage: note.stage || '',
        status: note.status || '',
        priority: note.priority || '',
        followUps: note.followUps ? JSON.stringify(note.followUps) : '[]',
        remarks: note.remarks || '',
        internalNotes: note.internalNotes || '',
        tags: note.tags ? note.tags.join(', ') : '',
        customFields: note.customFields ? JSON.stringify(note.customFields) : '{}',
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const values = Object.values(noteData);

      if (existingIndex >= 0) {
        // Update existing row
        const rowNumber = existingIndex + 2; // +2 for header and 0-index
        const range = `${NOTES_SHEET}!A${rowNumber}:L${rowNumber}`;
        
        await axios.put(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
          {
            values: [values],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Append new row
        const range = `${NOTES_SHEET}!A:L`;
        
        await axios.post(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`,
          {
            values: [values],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  }

  // Initialize Notes sheet with headers if it doesn't exist
  async initializeNotesSheet(): Promise<void> {
    const token = await this.getAccessToken();
    const headers = [
      'expirationId',
      'associateName',
      'stage',
      'status',
      'priority',
      'followUps',
      'remarks',
      'internalNotes',
      'tags',
      'customFields',
      'createdAt',
      'updatedAt',
    ];

    try {
      await axios.put(
        `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${NOTES_SHEET}!A1:L1?valueInputOption=RAW`,
        {
          values: [headers],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to initialize Notes sheet:', error);
      throw error;
    }
  }

  // Delete a note
  async deleteNote(expirationId: string): Promise<void> {
    const token = await this.getAccessToken();
    
    try {
      const existingNotes = await this.fetchNotes();
      const existingIndex = existingNotes.findIndex(n => n.expirationId === expirationId);

      if (existingIndex >= 0) {
        const rowNumber = existingIndex + 2;
        
        // Clear the row
        const range = `${NOTES_SHEET}!A${rowNumber}:L${rowNumber}`;
        await axios.put(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
          {
            values: [['', '', '', '', '', '', '', '', '', '', '', '']],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();