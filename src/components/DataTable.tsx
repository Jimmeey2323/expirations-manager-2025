import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight as ExpandIcon,
  ChevronDown as CollapseIcon,
  Columns,
  Check,
} from 'lucide-react';
import { ExpirationWithNotes } from '../types';
import { StatusBadge, PriorityBadge, MemberStatusBadge } from './Badge';
import { formatDateIST } from '../utils/dateFormat';
import { MultiSelect } from './Select';
import { FollowUpModal } from './FollowUpModal';

interface DataTableProps {
  data: ExpirationWithNotes[];
  onRowClick: (row: ExpirationWithNotes) => void;
  groupBy?: string;
  groupedData?: Record<string, ExpirationWithNotes[]>;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  onRowClick,
  groupBy = 'none',
  groupedData = {},
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    uniqueId: false, // Hide uniqueId by default
    id: false,
    membershipId: false,
    frozen: false,
    paid: false,
  });
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedExpiration, setSelectedExpiration] = useState<ExpirationWithNotes | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const columns = useMemo<ColumnDef<ExpirationWithNotes>[]>(
    () => [
      {
        accessorKey: 'uniqueId',
        header: 'Unique ID',
        enableHiding: true,
      },
      {
        accessorKey: 'memberId',
        header: 'Member ID',
        cell: ({ getValue }) => (
          <div className="font-semibold text-indigo-900">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: ({ getValue }) => (
          <div className="font-semibold text-gray-900">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        cell: ({ getValue }) => (
          <div className="font-semibold text-gray-900">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <div className="text-sm text-blue-700 hover:text-blue-900 underline cursor-pointer">
            {getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'membershipName',
        header: 'Membership',
        cell: ({ getValue }) => (
          <div className="font-medium text-purple-900 bg-purple-50 px-2 py-1 rounded">
            {getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="font-semibold text-red-700 bg-red-50 px-2 py-1 rounded">
              {formatDateIST(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'homeLocation',
        header: 'Location',
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-700">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'currentUsage',
        header: 'Usage',
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-700">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'orderAt',
        header: 'Order Date',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return value ? (
            <div className="text-sm text-gray-600">{formatDateIST(value)}</div>
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: 'soldBy',
        header: 'Sold By',
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-700">{getValue() as string || 'N/A'}</div>
        ),
      },
      {
        accessorKey: 'membershipId',
        header: 'Membership ID',
      },
      {
        accessorKey: 'frozen',
        header: 'Frozen',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return value === 'Yes' ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">Yes</span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">No</span>
          );
        },
      },
      {
        accessorKey: 'paid',
        header: 'Paid',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return value === 'Yes' ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Yes</span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">No</span>
          );
        },
      },
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="text-sm font-semibold text-green-700">
              {value && value !== '-' ? `₹${value}` : '-'}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Member Status',
        cell: ({ getValue }) => <MemberStatusBadge status={getValue() as string} />,
      },
      {
        accessorKey: 'notes.associateName',
        header: 'Associate',
        cell: ({ row }) => {
          // Prefer sheet value over notes value
          const sheetAssociate = row.original.assignedAssociate;
          const notesAssociate = row.original.notes?.associateName;
          const displayValue = (sheetAssociate && sheetAssociate !== '-') ? sheetAssociate : (notesAssociate || '-');
          
          return (
            <div className="text-sm font-medium text-indigo-700">
              {displayValue}
            </div>
          );
        },
      },
      {
        accessorKey: 'notes.stage',
        header: 'Reason for Lapsing',
        cell: ({ row }) => (
          <div className="text-sm text-gray-700 max-w-xs truncate" title={row.original.notes?.stage}>
            {row.original.notes?.stage || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'notes.status',
        header: 'Current Stage',
        cell: ({ row }) => <StatusBadge status={row.original.notes?.status} />,
      },
      {
        accessorKey: 'notes.priority',
        header: 'Priority',
        cell: ({ row }) => <PriorityBadge priority={row.original.notes?.priority} />,
      },
      {
        accessorKey: 'notes.tags',
        header: 'Tags',
        cell: ({ row }) => {
          const tags = row.original.notes?.tags || [];
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'notes.remarks',
        header: 'Remarks',
        cell: ({ row }) => (
          <div className="text-sm text-gray-600 max-w-xs truncate" title={row.original.notes?.remarks}>
            {row.original.notes?.remarks || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'notes.followUps',
        header: 'Follow-ups',
        size: 150,
        enableHiding: false,
        cell: ({ row }) => {
          const followUps = row.original.notes?.followUps || [];
          if (followUps.length === 0) {
            return <span className="text-gray-400 text-sm">-</span>;
          }
          
          return (
            <div className="h-10 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  setSelectedExpiration(row.original);
                  setFollowUpModalOpen(true);
                }}
                className="px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:shadow-md"
              >
                {followUps.length}
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Update page size
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const allColumnIds = table.getAllColumns()
    .filter(col => col.getCanHide())
    .map(col => col.id);

  const visibleColumnIds = table.getAllColumns()
    .filter(col => col.getIsVisible() && col.getCanHide())
    .map(col => col.id);

  const handleColumnVisibilityChange = (selectedIds: string[]) => {
    const newVisibility: VisibilityState = {};
    allColumnIds.forEach(id => {
      newVisibility[id] = selectedIds.includes(id);
    });
    setColumnVisibility(newVisibility);
  };

  // Render grouped rows if groupBy is active
  if (groupBy !== 'none' && Object.keys(groupedData).length > 0) {
    return (
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Column Visibility Dropdown */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Member Expirations</h3>
            <div className="relative">
              <button
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <Columns size={18} />
                <span className="text-sm font-medium">Columns</span>
                <ChevronDown size={16} />
              </button>
              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-3">
                    <MultiSelect
                      options={allColumnIds}
                      values={visibleColumnIds}
                      onChange={handleColumnVisibilityChange}
                      placeholder="Select columns..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grouped Content */}
        <div className="overflow-x-auto">
          {Object.entries(groupedData).map(([groupKey, groupRows]) => {
            const isExpanded = expanded[groupKey];
            return (
              <div key={groupKey} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {isExpanded ? <CollapseIcon size={20} className="text-indigo-600" /> : <ExpandIcon size={20} className="text-indigo-600" />}
                      <span className="font-bold text-gray-900">{groupKey}</span>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white text-sm font-bold rounded-full shadow-md inline-flex items-center justify-center min-w-[100px]">
                      {groupRows.length} members
                    </span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="bg-white">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 via-gray-900 to-black">
                        <tr>
                          {table.getVisibleLeafColumns().map(column => (
                            <th
                              key={column.id}
                              className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                            >
                              {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupRows.map((row, idx) => (
                          <tr
                            key={row.uniqueId}
                            onClick={() => onRowClick(row)}
                            className={`cursor-pointer transition-all hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 h-10 max-h-10 ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            {table.getVisibleLeafColumns().map(column => {
                              const accessor = column.id;
                              let cellValue;
                              
                              // Handle nested accessors like 'notes.status'
                              if (accessor.includes('.')) {
                                const parts = accessor.split('.');
                                cellValue = parts.reduce((obj: any, key) => obj?.[key], row);
                              } else {
                                cellValue = (row as any)[accessor];
                              }
                              
                              return (
                                <td key={column.id} className="px-4 py-2 text-sm whitespace-nowrap overflow-hidden">
                                  {column.columnDef.cell 
                                    ? typeof column.columnDef.cell === 'function'
                                      ? column.columnDef.cell({ 
                                          row: { original: row }, 
                                          getValue: () => cellValue 
                                        } as any)
                                      : cellValue
                                    : cellValue || '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular table view
  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header with Column Visibility */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Member Expirations
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 shadow-lg"
            >
              <Columns size={18} />
              <span className="text-sm font-medium">Column Visibility</span>
              <ChevronDown size={16} className={`transition-transform ${showColumnDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                <div className="p-4">
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Select Columns to Display</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleColumnVisibilityChange(allColumnIds)}
                        className="flex-1 text-xs px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors font-medium"
                      >
                        Show All
                      </button>
                      <button
                        onClick={() => handleColumnVisibilityChange([])}
                        className="flex-1 text-xs px-3 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded transition-colors font-medium"
                      >
                        Hide All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {table.getAllColumns().filter(col => col.getCanHide()).map(column => (
                      <label
                        key={column.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                        </span>
                        {column.getIsVisible() && (
                          <Check size={14} className="ml-auto text-green-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-900 via-gray-900 to-black sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp size={16} className="text-blue-300" />
                        ) : (
                          <ChevronDown size={16} className="text-blue-300" />
                        )
                      ) : (
                        <ChevronsUpDown size={14} className="text-gray-400 opacity-50" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className={`cursor-pointer transition-all duration-150 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg h-10 max-h-10 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm whitespace-nowrap overflow-hidden">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-4 text-sm font-medium text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              {' '}<span className="text-gray-500">({data.length} total records)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Follow-Up Modal */}
      <FollowUpModal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        expiration={selectedExpiration}
      />
    </div>
  );
};
