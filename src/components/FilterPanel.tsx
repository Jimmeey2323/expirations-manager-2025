import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X, Calendar } from 'lucide-react';
import { FilterState } from '../types';
import { useAppStore } from '../store/useAppStore';
import { STATUSES, PRIORITIES, STAGES } from '../constants/dropdownOptions';
import { Input } from './Input';
import { MultiSelect } from './Select';
import { Button } from './Button';

export const FilterPanel: React.FC = () => {
  const { filters, setFilters, isFilterCollapsed, toggleFilterCollapse, combinedData } = useAppStore();
  
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {};
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  // Get unique values for dropdowns from data
  const uniqueMembershipNames = [...new Set(combinedData.map(item => item.membershipName))].filter(Boolean);
  const uniqueHomeLocations = [...new Set(combinedData.map(item => item.homeLocation))].filter(Boolean);

  const activeFilterCount = Object.entries(localFilters).filter(([_, value]) => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-gray-100">
      {/* Header */}
      <button
        onClick={toggleFilterCollapse}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md">
            <Filter size={18} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {activeFilterCount} Active
            </span>
          )}
        </div>
        {isFilterCollapsed ? (
          <ChevronDown size={20} className="text-gray-400 transition-transform duration-200" />
        ) : (
          <ChevronUp size={20} className="text-gray-600 transition-transform duration-200" />
        )}
      </button>

      {/* Filter Content */}
      {!isFilterCollapsed && (
        <div className="px-6 py-6 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Member Name */}
            <Input
              label="Member Name"
              placeholder="Search by name..."
              value={localFilters.memberName || ''}
              onChange={(e) => handleFilterChange('memberName', e.target.value)}
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="Search by email..."
              value={localFilters.email || ''}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />

            {/* Membership Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Membership Name
              </label>
              <select
                value={localFilters.membershipName || ''}
                onChange={(e) => handleFilterChange('membershipName', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
              >
                <option value="">All Memberships</option>
                {uniqueMembershipNames.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            {/* Home Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Home Location
              </label>
              <select
                value={localFilters.homeLocation || ''}
                onChange={(e) => handleFilterChange('homeLocation', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
              >
                <option value="">All Locations</option>
                {uniqueHomeLocations.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            {/* Member Status */}
            <MultiSelect
              label="Member Status"
              options={['Active', 'Frozen', 'Expired', 'Churned']}
              values={localFilters.memberStatus || []}
              onChange={(value) => handleFilterChange('memberStatus', value)}
              placeholder="Select status..."
            />

            {/* Note Status */}
            <MultiSelect
              label="Note Status"
              options={STATUSES}
              values={localFilters.noteStatus || []}
              onChange={(value) => handleFilterChange('noteStatus', value)}
              placeholder="Select note status..."
            />

            {/* Lifecycle Stage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Reasons for Lapsing
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('stage', STAGES)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleFilterChange('stage', [])}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <MultiSelect
                  options={STAGES}
                  values={localFilters.stage || []}
                  onChange={(value) => handleFilterChange('stage', value)}
                  placeholder="Select reasons..."
                />
              </div>
            </div>

            {/* Priority */}
            <MultiSelect
              label="Priority"
              options={PRIORITIES}
              values={localFilters.priority || []}
              onChange={(value) => handleFilterChange('priority', value)}
              placeholder="Select priority..."
            />

            {/* End Date Range with Quick Filters */}
            <div className="col-span-2 space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                End Date Range
              </label>
              
              {/* Quick Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleFilterChange('endDateFrom', '2025-07-01');
                    handleFilterChange('endDateTo', '');
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                >
                  Default (From July 1st)
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const from = today.toISOString().split('T')[0];
                    const to = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
                    handleFilterChange('endDateFrom', from);
                    handleFilterChange('endDateTo', to);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                >
                  Next 7 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const from = today.toISOString().split('T')[0];
                    const to = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
                    handleFilterChange('endDateFrom', from);
                    handleFilterChange('endDateTo', to);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                >
                  Next 30 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const from = today.toISOString().split('T')[0];
                    const to = new Date(today.setDate(today.getDate() + 90)).toISOString().split('T')[0];
                    handleFilterChange('endDateFrom', from);
                    handleFilterChange('endDateTo', to);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm"
                >
                  Next 90 Days
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('endDateFrom', '');
                    handleFilterChange('endDateTo', '');
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
                >
                  Show All Data
                </button>
              </div>
              
              {/* Combined Date Range Input */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">From Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                      <input
                        type="date"
                        value={localFilters.endDateFrom || ''}
                        onChange={(e) => handleFilterChange('endDateFrom', e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="text-gray-400 font-bold pt-6">→</div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">To Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                      <input
                        type="date"
                        value={localFilters.endDateTo || ''}
                        onChange={(e) => handleFilterChange('endDateTo', e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
                {(localFilters.endDateFrom || localFilters.endDateTo) && (
                  <div className="mt-3 text-xs text-gray-600 flex items-center gap-2">
                    <span className="font-medium">Selected Range:</span>
                    <span className="bg-white px-2 py-1 rounded border border-gray-300">
                      {localFilters.endDateFrom || 'Any'} → {localFilters.endDateTo || 'Any'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <Input
              label="Tags"
              placeholder="Search by tags..."
              value={localFilters.tags || ''}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={applyFilters}
              variant="primary"
              className="shadow-lg"
            >
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
            >
              <X size={16} className="mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
