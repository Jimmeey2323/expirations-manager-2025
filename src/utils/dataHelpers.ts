import { ExpirationWithNotes, FilterState } from '../types';

export const applyFilters = (
  data: ExpirationWithNotes[],
  filters: FilterState
): ExpirationWithNotes[] => {
  return data.filter(item => {
    // Member Name filter
    if (filters.memberName) {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      if (!fullName.includes(filters.memberName.toLowerCase())) {
        return false;
      }
    }

    // Email filter
    if (filters.email && !item.email.toLowerCase().includes(filters.email.toLowerCase())) {
      return false;
    }

    // Membership Name filter
    if (filters.membershipName && !item.membershipName.toLowerCase().includes(filters.membershipName.toLowerCase())) {
      return false;
    }

    // Home Location filter
    if (filters.homeLocation && item.homeLocation && !item.homeLocation.toLowerCase().includes(filters.homeLocation.toLowerCase())) {
      return false;
    }

    // Member Status filter (array)
    if (filters.memberStatus && filters.memberStatus.length > 0) {
      if (!filters.memberStatus.includes(item.status)) {
        return false;
      }
    }

    // Note Status filter (array)
    if (filters.noteStatus && filters.noteStatus.length > 0) {
      if (!item.notes?.status || !filters.noteStatus.includes(item.notes.status)) {
        return false;
      }
    }

    // Stage filter (array)
    if (filters.stage && filters.stage.length > 0) {
      if (!item.notes?.stage || !filters.stage.includes(item.notes.stage)) {
        return false;
      }
    }

    // Priority filter (array)
    if (filters.priority && filters.priority.length > 0) {
      if (!item.notes?.priority || !filters.priority.includes(item.notes.priority)) {
        return false;
      }
    }

    // Associate Name filter
    if (filters.associateName && 
        (!item.notes?.associateName || 
         !item.notes.associateName.toLowerCase().includes(filters.associateName.toLowerCase()))) {
      return false;
    }

    // Tags filter
    if (filters.tags) {
      const itemTags = item.notes?.tags || [];
      const hasMatchingTag = itemTags.some(itemTag => 
        itemTag.toLowerCase().includes(filters.tags!.toLowerCase())
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // End date range filter
    if (filters.endDateFrom || filters.endDateTo) {
      if (!item.endDate) return false;

      // Normalize dates to midnight for comparison
      const itemDate = new Date(item.endDate);
      itemDate.setHours(0, 0, 0, 0);
      
      if (filters.endDateFrom) {
        const fromDate = new Date(filters.endDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) {
          return false;
        }
      }
      
      if (filters.endDateTo) {
        const toDate = new Date(filters.endDateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (itemDate > toDate) {
          return false;
        }
      }
    }

    return true;
  });
};

export const groupData = (
  data: ExpirationWithNotes[],
  groupBy: string
): Record<string, ExpirationWithNotes[]> => {
  if (groupBy === 'none') {
    return { 'All Items': data };
  }

  return data.reduce((groups, item) => {
    let key: string;

    switch (groupBy) {
      case 'offerName':
        key = item.membershipName || 'Uncategorized';
        break;
      case 'applicableOn':
        key = item.homeLocation || 'No Location';
        break;
      case 'idealFor':
        key = item.status || 'No Status';
        break;
      case 'status':
        key = item.notes?.status || 'No Note Status';
        break;
      case 'priority':
        key = item.notes?.priority || 'No Priority';
        break;
      case 'associateName':
        key = item.notes?.associateName || 'Unassigned';
        break;
      default:
        key = 'Uncategorized';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);

    return groups;
  }, {} as Record<string, ExpirationWithNotes[]>);
};
