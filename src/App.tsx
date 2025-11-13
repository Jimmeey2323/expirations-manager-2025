import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { FilterPanel } from './components/FilterPanel';
import { DataTable } from './components/DataTable';
import { DetailModal } from './components/DetailModal';
import { MetricCards } from './components/MetricCards';
import { Login } from './components/Login';
import { applyFilters, groupData } from './utils/dataHelpers';
import { supabase } from './config/supabase';
import { ASSOCIATES } from './constants/dropdownOptions';
import { 
  RefreshCw, 
  Database, 
  MapPin,
  Layers,
  Search,
  X,
  LogOut,
  User,
  Download,
  FileText,
  Copy,
} from 'lucide-react';
import { GroupingOption } from './types';
import { exportToCSV, exportToPDF, copyToClipboard, getTimestampedFilename } from './utils/exportHelpers';

const LOCATIONS = [
  { id: 'all', name: 'All Locations', icon: '🌍' },
  { id: 'Kenkere House', name: 'Kenkere House', icon: '🏢' },
  { id: 'Kwality House, Kemps Corner', name: 'Kwality House, Kemps Corner', icon: '🏛️' },
  { id: 'Supreme HQ, Bandra', name: 'Supreme HQ, Bandra', icon: '🏰' },
];

function App() {
  const {
    user,
    isAuthenticated,
    setUser,
    logout,
    combinedData,
    isLoading,
    error,
    fetchData,
    filters,
    groupBy,
    setGroupBy,
    openDetailModal,
    initializeNotesSheet,
  } = useAppStore();

  const [activeLocation, setActiveLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'next7' | 'next30' | 'past7' | 'past30' | 'thisMonth'>('all');

  // Check for existing Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        const emailLower = email.toLowerCase();
        
        // WHITELIST: Allow specific Gmail address
        const isWhitelistedGmail = emailLower === 'jimmygonda@gmail.com';
        
        // DOMAIN VALIDATION: Only allow physique57 emails OR whitelisted Gmail
        if (!emailLower.includes('physique57') && !isWhitelistedGmail) {
          supabase.auth.signOut();
          alert('Access denied. Only authorized emails are allowed.');
          return;
        }
        
        // AUTO-ADMIN: physique57india domain gets admin access (except info@physique57india.com)
        const isAdminDomain = emailLower.includes('physique57india') && 
                             emailLower !== 'info@physique57india.com';
        
        // Map email to associate name
        const associateName = mapEmailToAssociate(email);
        
        setUser({
          email,
          name: session.user.user_metadata?.full_name || session.user.email,
          isAdmin: isAdminDomain,
          associateName,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const emailLower = email.toLowerCase();
        
        // WHITELIST: Allow specific Gmail address
        const isWhitelistedGmail = emailLower === 'jimmygonda@gmail.com';
        
        // DOMAIN VALIDATION: Only allow physique57 emails OR whitelisted Gmail
        if (!emailLower.includes('physique57') && !isWhitelistedGmail) {
          supabase.auth.signOut();
          alert('Access denied. Only authorized emails are allowed.');
          return;
        }
        
        // AUTO-ADMIN: physique57india domain gets admin access (except info@physique57india.com)
        const isAdminDomain = emailLower.includes('physique57india') && 
                             emailLower !== 'info@physique57india.com';
        
        // Map email to associate name
        const associateName = mapEmailToAssociate(email);
        
        setUser({
          email,
          name: session.user.user_metadata?.full_name || session.user.email,
          isAdmin: isAdminDomain,
          associateName,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // Map email to associate name (you can customize this mapping)
  const mapEmailToAssociate = (email: string): string | undefined => {
    // SPECIFIC MAPPING: Whitelisted Gmail to associate
    if (email.toLowerCase() === 'jimmygonda@gmail.com') {
      return 'Admin Admin';
    }
    
    // Extract the email name part (before @)
    const emailName = email.split('@')[0].toLowerCase();
    
    // Try to find a matching associate
    const found = ASSOCIATES.find(assoc => {
      const firstName = assoc.toLowerCase().split(' ')[0];
      const lastName = assoc.toLowerCase().split(' ')[1] || '';
      
      // Check if email contains first name OR last name
      return emailName.includes(firstName) || 
             (lastName && emailName.includes(lastName)) ||
             firstName.includes(emailName);
    });
    
    return found;
  };

  // Handle logout
  const handleLogout = async () => {
    if (user?.isAdmin) {
      logout();
    } else {
      await supabase.auth.signOut();
      logout();
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Apply filters to data with location filter AND user-based filtering
  const filteredData = useMemo(() => {
    if (!isAuthenticated) return [];
    
    let data = applyFilters(combinedData, filters);
    
    // Filter by user's associate name (unless admin)
    if (!user?.isAdmin && user?.associateName) {
      data = data.filter(item => {
        const sheetAssociate = item.assignedAssociate;
        const notesAssociate = item.notes?.associateName;
        const itemAssociate = (sheetAssociate && sheetAssociate !== '-') ? sheetAssociate : notesAssociate;
        return itemAssociate === user.associateName;
      });
    }
    
    // Apply location filter
    if (activeLocation !== 'all') {
      data = data.filter(item => item.homeLocation === activeLocation);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.firstName?.toLowerCase().includes(search) ||
        item.lastName?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.membershipName?.toLowerCase().includes(search) ||
        item.memberId?.toLowerCase().includes(search)
      );
    }
    
    // Apply quick period filter
    if (quickFilter !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      
      data = data.filter(item => {
        const endDate = new Date(item.endDate);
        endDate.setHours(0, 0, 0, 0); // Start of end date
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (quickFilter === 'next7') {
          // Expires in the next 7 days (0 to 7 days from now)
          return diffDays >= 0 && diffDays <= 7;
        } else if (quickFilter === 'next30') {
          // Expires in the next 30 days (0 to 30 days from now)
          return diffDays >= 0 && diffDays <= 30;
        } else if (quickFilter === 'past7') {
          // Expired in the last 7 days (7 days ago to yesterday)
          return diffDays < 0 && diffDays >= -7;
        } else if (quickFilter === 'past30') {
          // Expired in the last 30 days (30 days ago to yesterday)
          return diffDays < 0 && diffDays >= -30;
        } else if (quickFilter === 'thisMonth') {
          // Expires this month
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const endMonth = endDate.getMonth();
          const endYear = endDate.getFullYear();
          return currentMonth === endMonth && currentYear === endYear;
        }
        return true;
      });
    }
    
    return data;
  }, [isAuthenticated, combinedData, filters, activeLocation, searchTerm, quickFilter, user]);

  // Group data
  const groupedData = useMemo(() => {
    return groupData(filteredData, groupBy);
  }, [filteredData, groupBy]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleInitializeNotes = async () => {
    if (window.confirm('This will initialize the Notes sheet. Continue?')) {
      await initializeNotesSheet();
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const filename = getTimestampedFilename('expirations-export', 'csv');
    exportToCSV(filteredData, filename);
  };

  const handleExportPDF = () => {
    const filename = getTimestampedFilename('expirations-export', 'pdf');
    exportToPDF(filteredData, filename);
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(filteredData);
  };

  const groupingOptions: { value: GroupingOption; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'No Grouping', icon: <Layers size={16} /> },
    { value: 'offerName', label: 'By Membership', icon: <Layers size={16} /> },
    { value: 'applicableOn', label: 'By Location', icon: <Layers size={16} /> },
    { value: 'idealFor', label: 'By Member Status', icon: <Layers size={16} /> },
    { value: 'status', label: 'By Note Status', icon: <Layers size={16} /> },
    { value: 'priority', label: 'By Priority', icon: <Layers size={16} /> },
    { value: 'associateName', label: 'By Associate', icon: <Layers size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white shadow-2xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full">
                  <MapPin size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Expirations Manager 2025
                </h1>
                <p className="text-slate-300 mt-1 flex items-center gap-2">
                  Track and manage member expirations
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Live
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* User info */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                <User size={16} className="text-blue-400" />
                <div className="text-sm">
                  <p className="font-semibold text-white">{user?.name || user?.email}</p>
                  {user?.isAdmin && (
                    <p className="text-xs text-emerald-400 font-medium">Administrator</p>
                  )}
                  {!user?.isAdmin && user?.associateName && (
                    <p className="text-xs text-purple-300">{user.associateName}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={handleInitializeNotes}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 border border-slate-600"
              >
                <Database size={18} />
                Init Notes Sheet
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Location Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap flex items-center justify-center gap-2 ${
                  activeLocation === location.id
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{location.icon}</span>
                {location.name}
                {activeLocation === location.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 shadow-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Metric Cards */}
        <MetricCards data={filteredData} />

        {/* Filter Panel */}
        <FilterPanel />

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-md px-6 py-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Grouping Options */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Group By:</span>
              <div className="flex gap-2">
                {groupingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGroupBy(option.value)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm ${
                      groupBy === option.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Export:</span>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={filteredData.length === 0}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Export as CSV"
                >
                  <Download size={16} />
                  CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={filteredData.length === 0}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Export as PDF"
                >
                  <FileText size={16} />
                  PDF
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  disabled={filteredData.length === 0}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>

            {/* View Mode Toggle - Hidden for now since only table view is implemented */}
            {/* <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex gap-2">
                {viewModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === mode.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={mode.label}
                  >
                    {mode.icon}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Stats */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{combinedData.length}</span> items
            </div>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="bg-white rounded-xl shadow-md px-6 py-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, membership, or member ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Period Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
              <button
                onClick={() => setQuickFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Periods
              </button>
              <button
                onClick={() => setQuickFilter('next7')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'next7'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Next 7 Days
              </button>
              <button
                onClick={() => setQuickFilter('next30')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'next30'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                Next 30 Days
              </button>
              <button
                onClick={() => setQuickFilter('past7')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'past7'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Past 7 Days
              </button>
              <button
                onClick={() => setQuickFilter('past30')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'past30'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                Past 30 Days
              </button>
              <button
                onClick={() => setQuickFilter('thisMonth')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  quickFilter === 'thisMonth'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {/* Data Display */}
        {isLoading && combinedData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md px-6 py-12 text-center">
            <RefreshCw size={48} className="mx-auto text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : groupBy === 'none' ? (
          <DataTable 
            data={filteredData} 
            onRowClick={openDetailModal}
            groupBy={groupBy}
            groupedData={{}}
          />
        ) : (
          <DataTable 
            data={filteredData} 
            onRowClick={openDetailModal}
            groupBy={groupBy}
            groupedData={groupedData}
          />
        )}

        {/* No Data Message */}
        {!isLoading && filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-md px-6 py-12 text-center">
            <p className="text-gray-600">No expirations found. Try adjusting your filters.</p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  );
}

export default App;
