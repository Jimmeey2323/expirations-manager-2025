// Expiration data structure (read-only from Google Sheets)
export interface Expiration {
  uniqueId: string; // Unique Id from sheet
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipName: string;
  endDate: string;
  homeLocation: string;
  currentUsage: string;
  id: string;
  orderAt: string;
  soldBy: string;
  membershipId: string;
  frozen: string;
  paid: string;
  status: string;
}

// Follow-up entry structure
export interface FollowUpEntry {
  date: string;
  comment: string;
  associateName?: string;
  contactedOn?: string; // Datetime when the member was contacted
  timestamp?: string;
}

// Annotation data structure (user-editable, stored in Notes sheet)
export interface ExpirationNote {
  expirationId: string; // Maps to Expiration.uniqueId
  associateName?: string;
  stage?: string; // Lifecycle stage/reason
  status?: string;
  priority?: string;
  tags?: string[];
  followUps?: FollowUpEntry[]; // Multiple follow-up entries
  remarks?: string;
  internalNotes?: string;
  customFields?: Record<string, any>; // For dynamic fields
  createdAt?: string;
  updatedAt?: string;
}

// Combined view for display
export interface ExpirationWithNotes extends Expiration {
  notes?: ExpirationNote;
}

// Filter state
export interface FilterState {
  memberName?: string;
  email?: string;
  membershipName?: string;
  homeLocation?: string;
  memberStatus?: string[];
  noteStatus?: string[];
  priority?: string[];
  associateName?: string;
  stage?: string[];
  tags?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

// Table grouping options
export type GroupingOption = 
  | 'none'
  | 'offerName'
  | 'applicableOn'
  | 'idealFor'
  | 'status'
  | 'priority'
  | 'associateName';

// View modes
export type ViewMode = 'table' | 'compact' | 'cards';
