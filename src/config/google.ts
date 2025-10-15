// Google Sheets Configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "",
  REFRESH_TOKEN: import.meta.env.VITE_GOOGLE_REFRESH_TOKEN || "",
  TOKEN_URL: "https://oauth2.googleapis.com/token"
};

export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "";
export const EXPIRATIONS_SHEET = "Expirations";
export const NOTES_SHEET = "Notes";

// API Configuration
export const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
