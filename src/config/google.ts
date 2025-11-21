// Google Sheets Configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "416630995185-007ermh3iidknbbtdmu5vct207mdlbaa.apps.googleusercontent.com",
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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",
  REFRESH_TOKEN: import.meta.env.VITE_GOOGLE_REFRESH_TOKEN || "1//045tUzUZK5YdaCgYIARAAGAQSNwF-L9IrP6WrfNCq1j2Gopc75jsLMmKH5jP1kRlFiKsaPj-DmqHtufGHNGfk5ZVQuh3ODo2M4Eo",
  TOKEN_URL: "https://oauth2.googleapis.com/token"
};

export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "1rGMDDvvTbZfNg1dueWtRN3LhOgGQOdLg3Fd7Sn1GCZo";
export const EXPIRATIONS_SHEET = "Expirations";
export const NOTES_SHEET = "Notes";

// API Configuration
export const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
