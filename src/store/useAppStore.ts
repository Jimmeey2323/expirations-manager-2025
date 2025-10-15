import { create } from 'zustand';
import { Expiration, ExpirationNote, ExpirationWithNotes, FilterState, GroupingOption, ViewMode } from '../types';
import { googleSheetsService } from '../services/googleSheets';
import { getPriority } from '../utils/priorityHelper';

interface AppState {
  // Data
  expirations: Expiration[];
  notes: ExpirationNote[];
  combinedData: ExpirationWithNotes[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedExpiration: ExpirationWithNotes | null;
  isDetailModalOpen: boolean;
  
  // Filter & View
  filters: FilterState;
  groupBy: GroupingOption;
  viewMode: ViewMode;
  isFilterCollapsed: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  saveNote: (expirationId: string, note: Partial<ExpirationNote>) => Promise<void>;
  deleteNote: (expirationId: string) => Promise<void>;
  setFilters: (filters: FilterState) => void;
  setGroupBy: (groupBy: GroupingOption) => void;
  setViewMode: (viewMode: ViewMode) => void;
  toggleFilterCollapse: () => void;
  openDetailModal: (expiration: ExpirationWithNotes) => void;
  closeDetailModal: () => void;
  initializeNotesSheet: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  expirations: [],
  notes: [],
  combinedData: [],
  isLoading: false,
  error: null,
  selectedExpiration: null,
  isDetailModalOpen: false,
  filters: {
    endDateFrom: '2025-07-01', // Default: show data from 01/07/2025 onwards
  },
  groupBy: 'none',
  viewMode: 'table',
  isFilterCollapsed: true,

  // Fetch data from Google Sheets
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [expirations, notes] = await Promise.all([
        googleSheetsService.fetchExpirations(),
        googleSheetsService.fetchNotes(),
      ]);

      // Combine expirations with their notes (map by uniqueId)
      const combinedData = expirations.map(exp => {
        const note = notes.find(n => n.expirationId === exp.uniqueId);
        
        // Auto-calculate priority if not manually set
        const autoPriority = getPriority(note?.priority, exp.endDate);
        
        return {
          ...exp,
          notes: note ? {
            ...note,
            priority: note.priority || autoPriority, // Use manual priority if set, otherwise auto
          } : {
            expirationId: exp.uniqueId,
            priority: autoPriority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      });

      set({ expirations, notes, combinedData, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Save or update a note
  saveNote: async (expirationId: string, noteData: Partial<ExpirationNote>) => {
    set({ isLoading: true, error: null });
    try {
      const { notes } = get();
      const existingNote = notes.find(n => n.expirationId === expirationId);

      const updatedNote: ExpirationNote = {
        ...existingNote,
        ...noteData,
        expirationId,
        updatedAt: new Date().toISOString(),
      };

      if (!existingNote) {
        updatedNote.createdAt = new Date().toISOString();
      }

      await googleSheetsService.saveNote(updatedNote);
      await get().fetchData(); // Refresh data
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Delete a note
  deleteNote: async (expirationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await googleSheetsService.deleteNote(expirationId);
      await get().fetchData(); // Refresh data
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Set filters
  setFilters: (filters: FilterState) => set({ filters }),

  // Set grouping
  setGroupBy: (groupBy: GroupingOption) => set({ groupBy }),

  // Set view mode
  setViewMode: (viewMode: ViewMode) => set({ viewMode }),

  // Toggle filter panel
  toggleFilterCollapse: () => set(state => ({ isFilterCollapsed: !state.isFilterCollapsed })),

  // Open detail modal
  openDetailModal: (expiration: ExpirationWithNotes) => {
    set({ selectedExpiration: expiration, isDetailModalOpen: true });
  },

  // Close detail modal
  closeDetailModal: () => {
    set({ isDetailModalOpen: false, selectedExpiration: null });
  },

  // Initialize Notes sheet
  initializeNotesSheet: async () => {
    set({ isLoading: true, error: null });
    try {
      await googleSheetsService.initializeNotesSheet();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
