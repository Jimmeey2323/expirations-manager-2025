import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExpirationWithNotes } from '../types';
import { formatDateIST } from './dateFormat';

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: ExpirationWithNotes[], filename: string = 'expirations-export.csv') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Member ID',
    'First Name',
    'Last Name',
    'Email',
    'Membership',
    'End Date',
    'Location',
    'Status',
    'Priority',
    'Assigned Associate',
    'Stage',
    'Revenue',
    'Sold By',
    'Frozen',
    'Paid',
    'Latest Follow-up',
    'Remarks',
  ];

  // Convert data to CSV rows
  const rows = data.map(item => {
    const latestFollowUp = item.notes?.followUps && item.notes.followUps.length > 0
      ? item.notes.followUps[item.notes.followUps.length - 1].comment
      : '';

    return [
      item.memberId || '',
      item.firstName || '',
      item.lastName || '',
      item.email || '',
      item.membershipName || '',
      formatDateIST(item.endDate),
      item.homeLocation || '',
      item.notes?.status || item.status || '',
      item.notes?.priority || '',
      item.assignedAssociate || item.notes?.associateName || '',
      item.notes?.stage || '',
      item.revenue || '',
      item.soldBy || '',
      item.frozen || '',
      item.paid || '',
      latestFollowUp,
      item.notes?.remarks || '',
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to PDF format
 */
export const exportToPDF = (data: ExpirationWithNotes[], filename: string = 'expirations-export.pdf') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better fit
  
  // Add title
  doc.setFontSize(18);
  doc.text('Expirations Report', 14, 15);
  
  // Add export date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  doc.text(`Total Records: ${data.length}`, 14, 27);

  // Prepare table data
  const tableHeaders = [
    'Member ID',
    'Name',
    'Email',
    'Membership',
    'End Date',
    'Location',
    'Status',
    'Priority',
    'Associate',
    'Stage',
  ];

  const tableRows = data.map(item => [
    item.memberId || '',
    `${item.firstName || ''} ${item.lastName || ''}`.trim(),
    item.email || '',
    item.membershipName || '',
    formatDateIST(item.endDate),
    item.homeLocation || '',
    item.notes?.status || item.status || '',
    item.notes?.priority || '',
    item.assignedAssociate || item.notes?.associateName || '',
    item.notes?.stage || '',
  ]);

  // Add table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: 32,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Member ID
      1: { cellWidth: 30 }, // Name
      2: { cellWidth: 40 }, // Email
      3: { cellWidth: 30 }, // Membership
      4: { cellWidth: 22 }, // End Date
      5: { cellWidth: 30 }, // Location
      6: { cellWidth: 20 }, // Status
      7: { cellWidth: 18 }, // Priority
      8: { cellWidth: 25 }, // Associate
      9: { cellWidth: 22 }, // Stage
    },
  });

  // Save the PDF
  doc.save(filename);
};

/**
 * Copy data to clipboard in tab-separated format (pasteable to Excel/Google Sheets)
 */
export const copyToClipboard = async (data: ExpirationWithNotes[]) => {
  if (data.length === 0) {
    alert('No data to copy');
    return;
  }

  // Define headers
  const headers = [
    'Member ID',
    'First Name',
    'Last Name',
    'Email',
    'Membership',
    'End Date',
    'Location',
    'Status',
    'Priority',
    'Assigned Associate',
    'Stage',
    'Revenue',
    'Sold By',
    'Frozen',
    'Paid',
    'Latest Follow-up',
    'Remarks',
  ];

  // Convert data to rows
  const rows = data.map(item => {
    const latestFollowUp = item.notes?.followUps && item.notes.followUps.length > 0
      ? item.notes.followUps[item.notes.followUps.length - 1].comment
      : '';

    return [
      item.memberId || '',
      item.firstName || '',
      item.lastName || '',
      item.email || '',
      item.membershipName || '',
      formatDateIST(item.endDate),
      item.homeLocation || '',
      item.notes?.status || item.status || '',
      item.notes?.priority || '',
      item.assignedAssociate || item.notes?.associateName || '',
      item.notes?.stage || '',
      item.revenue || '',
      item.soldBy || '',
      item.frozen || '',
      item.paid || '',
      latestFollowUp,
      item.notes?.remarks || '',
    ];
  });

  // Create tab-separated text
  const tsvContent = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  try {
    await navigator.clipboard.writeText(tsvContent);
    alert(`Successfully copied ${data.length} rows to clipboard! You can now paste into Excel or Google Sheets.`);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    alert('Failed to copy to clipboard. Please try again.');
  }
};

/**
 * Get a timestamped filename
 */
export const getTimestampedFilename = (prefix: string, extension: string): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
};
