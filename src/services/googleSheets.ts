import axios from 'axios';
import { GOOGLE_CONFIG, SPREADSHEET_ID, EXPIRATIONS_SHEET, NOTES_SHEET, SHEETS_API_BASE } from '../config/google';
import { Expiration, ExpirationNote } from '../types';

class GoogleSheetsService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Normalize header string to a canonical key (remove spaces/underscores, lowercase)
  private normalizeHeader(header: string): string {
    return (header || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Map common header aliases to canonical property names used in the app
  private headerToKey(header: string): string {
    const h = this.normalizeHeader(header);
    const map: Record<string, string> = {
      expirationid: 'expirationId',
      uniqueid: 'expirationId',
      id: 'expirationId',
      memberid: 'memberId',
      firstname: 'firstName',
      lastname: 'lastName',
      email: 'email',
      membershipname: 'membershipName',
      enddate: 'endDate',
      homelocation: 'homeLocation',
      currentusage: 'currentUsage',
      orderat: 'orderAt',
      soldby: 'soldBy',
      membershipid: 'membershipId',
      frozen: 'frozen',
      paid: 'paid',
      status: 'status',
      revenue: 'revenue',
      assignedassociate: 'assignedAssociate',

      // Notes sheet specific
      associatename: 'associateName',
      stage: 'stage',
      priority: 'priority',
      followups: 'followUps',
      remarks: 'remarks',
      internalnotes: 'internalNotes',
      tags: 'tags',
      customfields: 'customFields',
      createdat: 'createdAt',
      updatedat: 'updatedAt',
    };

    return map[h] || header; // fallback to original header string if unknown
  }

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

  // Ensure spreadsheet id is configured
  private ensureSpreadsheetId() {
    if (!SPREADSHEET_ID || SPREADSHEET_ID.trim() === '') {
      throw new Error('SPREADSHEET_ID is not configured. Please set VITE_SPREADSHEET_ID in your environment.');
    }
  }

  // Fetch expirations from the Expirations sheet (new format)
  async fetchExpirations(): Promise<Expiration[]> {
    this.ensureSpreadsheetId();
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
    this.ensureSpreadsheetId();
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
      const rawHeaders: string[] = rows[0] || [];
      const headers = rawHeaders.map(h => this.headerToKey(h));
      const dataRows = rows.slice(1);

      const parsedNotes = dataRows
        .filter((row: string[]) => {
          // Find expirationId column index (after header normalization)
          const expIdIndex = headers.findIndex(h => this.normalizeHeader(h) === 'expirationid' || h === 'expirationId');
          const cell = row[expIdIndex];
          return row.length > 0 && cell && String(cell).trim() !== '';
        })
        .map((row: string[]) => {
          const note: any = {};
          headers.forEach((key: string, index: number) => {
            const value = row[index] || '';

            // Map parsed values into canonical properties
            const normalizedKey = this.normalizeHeader(key);
            if ((normalizedKey === 'tags' || key === 'tags') && value) {
              note['tags'] = String(value).split(',').map((t: string) => t.trim()).filter(Boolean);
            } else if ((normalizedKey === 'followups' || key === 'followUps') && value) {
              try {
                note['followUps'] = JSON.parse(value as string);
              } catch {
                note['followUps'] = [];
              }
            } else if ((normalizedKey === 'customfields' || key === 'customFields') && value) {
              try {
                note['customFields'] = JSON.parse(value as string);
              } catch {
                note['customFields'] = {};
              }
            } else {
              // Use canonical header mapping to set property names
              const prop = this.headerToKey(key);
              note[prop] = value;
            }
          });

          // Ensure expirationId exists on the parsed note (try common aliases if needed)
          if (!note.expirationId) {
            // Try to find common alternate fields
            note.expirationId = note.expirationId || note.uniqueId || note.id || '';
          }

          return note as ExpirationNote;
        });

      // Consolidate duplicates by expirationId (merge followUps/tags and keep latest updatedAt)
      const noteMap: Record<string, ExpirationNote> = {};
      parsedNotes.forEach((n: ExpirationNote) => {
        const id = String(n.expirationId || '').trim();
        if (!id) return; // skip rows without id

        const existing = noteMap[id];
        if (!existing) {
          noteMap[id] = n;
        } else {
          // Merge followUps
          const existingF = Array.isArray(existing.followUps) ? existing.followUps : [];
          const newF = Array.isArray(n.followUps) ? n.followUps : [];
          const combinedF = [...existingF, ...newF];
          // Deduplicate followUps by timestamp or JSON
          const seen = new Set<string>();
          const dedupedF = combinedF.filter((fu) => {
            const key = fu && fu.timestamp ? fu.timestamp : JSON.stringify(fu);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          // Merge tags
          const existingTags = Array.isArray(existing.tags) ? existing.tags : [];
          const newTags = Array.isArray(n.tags) ? n.tags : [];
          const mergedTags = Array.from(new Set([...existingTags, ...newTags]));

          // Choose latest updatedAt
          const existingUpdated = existing.updatedAt ? Date.parse(String(existing.updatedAt)) : 0;
          const newUpdated = n.updatedAt ? Date.parse(String(n.updatedAt)) : 0;
          const latest = existingUpdated >= newUpdated ? existing : n;

          noteMap[id] = {
            ...latest,
            followUps: dedupedF,
            tags: mergedTags,
            // prefer non-empty remarks/internalNotes if available
            remarks: n.remarks || existing.remarks || '',
            internalNotes: n.internalNotes || existing.internalNotes || '',
            associateName: n.associateName || existing.associateName || '',
            stage: n.stage || existing.stage || '',
            status: n.status || existing.status || '',
            priority: n.priority || existing.priority || '',
            customFields: n.customFields || existing.customFields || {},
            createdAt: existing.createdAt || n.createdAt,
            updatedAt: newUpdated >= existingUpdated ? (n.updatedAt || existing.updatedAt) : existing.updatedAt,
          } as ExpirationNote;
        }
      });

      return Object.values(noteMap);
    } catch (error) {
      // If Notes sheet doesn't exist or is empty, return empty array
      console.warn('Notes sheet not found or empty:', error);
      return [];
    }
  }

  // Save or update a note in the Notes sheet
  async saveNote(note: ExpirationNote): Promise<void> {
    this.ensureSpreadsheetId();
    const token = await this.getAccessToken();
    
    try {
      // Fetch raw header row to build header index mapping
      const headersResp = await axios.get(
        `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${NOTES_SHEET}!A1:Z1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawHeaders: string[] = (headersResp.data.values && headersResp.data.values[0]) || [];
      const headers = rawHeaders.map(h => this.headerToKey(h));

      // Build a column->index map
      const headerIndex: Record<string, number> = {};
      headers.forEach((h, idx) => {
        const key = this.normalizeHeader(h);
        headerIndex[key] = idx;
      });

      // Ensure at least a minimal set of columns exist
      const columnCount = Math.max(headers.length, 12);

      // Helper to write value into columns array at canonical key
      const columns: any[] = new Array(columnCount).fill('');

      const setCol = (key: string, value: any) => {
        const nk = this.normalizeHeader(key);
        const idx = headerIndex[nk];
        if (idx !== undefined && idx >= 0) {
          columns[idx] = value;
        } else {
          // If header not present, try to append at first empty slot
          const emptyIdx = columns.findIndex(c => c === '');
          if (emptyIdx >= 0) {
            columns[emptyIdx] = value;
            // also register it to headerIndex for future updates
            headerIndex[nk] = emptyIdx;
          }
        }
      };

      // Populate columns using canonical keys
      setCol('expirationId', note.expirationId || '');
      setCol('associateName', note.associateName || '');
      setCol('stage', note.stage || '');
      setCol('status', note.status || '');
      setCol('priority', note.priority || '');
      setCol('followUps', note.followUps ? JSON.stringify(note.followUps) : '[]');
      setCol('remarks', note.remarks || '');
      setCol('internalNotes', note.internalNotes || '');
      setCol('tags', note.tags ? note.tags.join(', ') : '');
      setCol('customFields', note.customFields ? JSON.stringify(note.customFields) : '{}');
      setCol('createdAt', note.createdAt || new Date().toISOString());
      setCol('updatedAt', new Date().toISOString());

      // Fetch existing notes to find the row index based on expirationId
      const existingNotes = await this.fetchNotes();
      const existingIndex = existingNotes.findIndex(n => String(n.expirationId || '').trim() === String(note.expirationId || '').trim());

      // If existing note exists, merge followUps/tags to avoid losing previous comments
      if (existingIndex >= 0) {
        const existingNote = existingNotes[existingIndex];
        const existingF = Array.isArray(existingNote.followUps) ? existingNote.followUps : [];
        const incomingF = Array.isArray(note.followUps) ? note.followUps : [];
        const combinedF = [...existingF, ...incomingF];
        const seen = new Set<string>();
        const dedupedF = combinedF.filter((fu) => {
          const key = fu && fu.timestamp ? fu.timestamp : JSON.stringify(fu);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // merge tags
        const existingTags = Array.isArray(existingNote.tags) ? existingNote.tags : [];
        const incomingTags = Array.isArray(note.tags) ? note.tags : [];
        const mergedTags = Array.from(new Set([...existingTags, ...incomingTags]));

        // update columns to use merged values
        setCol('followUps', JSON.stringify(dedupedF));
        setCol('tags', mergedTags.join(', '));

        // ensure createdAt preserved
        setCol('createdAt', existingNote.createdAt || note.createdAt || new Date().toISOString());
      }

      // Helper to convert column index to spreadsheet column letter (A, B, ..., Z, AA, AB...)
      const columnLetter = (colIndex: number) => {
        let dividend = colIndex + 1;
        let columnName = '';
        while (dividend > 0) {
          let modulo = (dividend - 1) % 26;
          columnName = String.fromCharCode(65 + modulo) + columnName;
          dividend = Math.floor((dividend - modulo) / 26);
        }
        return columnName;
      };

      const lastColLetter = columnLetter(columnCount - 1);

      if (existingIndex >= 0) {
        const rowNumber = existingIndex + 2; // headers + 1
        const range = `${NOTES_SHEET}!A${rowNumber}:${lastColLetter}${rowNumber}`;

        await axios.put(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
          { values: [columns] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const range = `${NOTES_SHEET}!A:${lastColLetter}`;
        await axios.post(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`,
          { values: [columns] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  }

  // Initialize Notes sheet with headers if it doesn't exist
  async initializeNotesSheet(): Promise<void> {
    this.ensureSpreadsheetId();
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
    this.ensureSpreadsheetId();
    const token = await this.getAccessToken();
    
    try {
      const existingNotes = await this.fetchNotes();
      const existingIndex = existingNotes.findIndex(n => String(n.expirationId || '').trim() === String(expirationId || '').trim());

      if (existingIndex >= 0) {
        const rowNumber = existingIndex + 2;

        // Fetch header length to know how many columns to clear
        const headersResp = await axios.get(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${NOTES_SHEET}!A1:Z1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const rawHeaders: string[] = (headersResp.data.values && headersResp.data.values[0]) || [];
        const columnCount = Math.max(rawHeaders.length, 12);

        const emptyRow = new Array(columnCount).fill('');
        const lastColLetter = (() => {
          let dividend = columnCount;
          let columnName = '';
          while (dividend > 0) {
            let modulo = (dividend - 1) % 26;
            columnName = String.fromCharCode(65 + modulo) + columnName;
            dividend = Math.floor((dividend - modulo) / 26);
          }
          return columnName;
        })();

        const range = `${NOTES_SHEET}!A${rowNumber}:${lastColLetter}${rowNumber}`;
        await axios.put(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
          { values: [emptyRow] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();