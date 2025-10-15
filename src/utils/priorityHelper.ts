/**
 * Auto-calculate priority based on days to expiration
 * The closer the expiration date, the higher the priority
 */
export const calculateAutoPriority = (endDate: string | null): string => {
  if (!endDate) return 'Low';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expirationDate = new Date(endDate);
  expirationDate.setHours(0, 0, 0, 0);
  
  // Calculate days difference
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Priority logic:
  // High: Already expired or expiring within 30 days
  // Medium: Expiring between 31-90 days
  // Low: Expiring after 90 days
  
  if (diffDays < 0) {
    return 'High'; // Already expired
  } else if (diffDays <= 30) {
    return 'High'; // Expiring soon (within 30 days)
  } else if (diffDays <= 90) {
    return 'Medium'; // Expiring in 1-3 months
  } else {
    return 'Low'; // Expiring after 3 months
  }
};

/**
 * Get priority to use - manual priority takes precedence, otherwise auto-calculate
 */
export const getPriority = (manualPriority: string | undefined, endDate: string | null): string => {
  // If user has manually set priority, use that
  if (manualPriority && manualPriority.trim() !== '') {
    return manualPriority;
  }
  
  // Otherwise, auto-calculate based on expiration date
  return calculateAutoPriority(endDate);
};
