// Google Sheets Configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "416630995185-g7b0fm679lb4p45p5lou070cqscaalaf.apps.googleusercontent.com",
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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",
  REFRESH_TOKEN: import.meta.env.VITE_GOOGLE_REFRESH_TOKEN || "1//04yfYtJTsGbluCgYIARAAGAQSNwF-L9Ir3g0kqAfdV7MLUcncxyc5-U0rp2T4rjHmGaxLUF3PZy7VX8wdumM8_ABdltAqXTsC6sk",
  TOKEN_URL: "https://oauth2.googleapis.com/token"
};

export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "";
export const EXPIRATIONS_SHEET = "Expirations";
export const NOTES_SHEET = "Notes";

// API Configuration
export const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";