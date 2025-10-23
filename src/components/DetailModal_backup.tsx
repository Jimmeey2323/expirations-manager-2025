import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ExpirationNote, FollowUpEntry } from '../types';
import { StatusBadge, PriorityBadge, MemberStatusBadge } from './Badge';
import { useAppStore } from '../store/useAppStore';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Tag, 
  Save, 
  Trash2, 
  Plus,
  X,
  MessageSquare,
  FileText,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ASSOCIATES, STAGES, STATUSES, PRIORITIES } from '../constants/dropdownOptions';
import { Input, Textarea } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Card, CardHeader, CardBody } from './Card';

type TabType = 'info' | 'followups' | 'notes' | 'tracking';

export const DetailModal: React.FC = () => {
  const { selectedExpiration, isDetailModalOpen, closeDetailModal, saveNote, deleteNote } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [formData, setFormData] = useState<Partial<ExpirationNote>>({
    associateName: '',
    stage: '',
    status: '',
    priority: '',
    followUps: [],
    remarks: '',
    internalNotes: '',
    tags: [],
  });

  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUpEntry>>({
    date: new Date().toISOString().split('T')[0],
    comment: '',
    associateName: '',
    contactedOn: '',
  });

  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [showCustomReasonError, setShowCustomReasonError] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDetailModalOpen) {
        closeDetailModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isDetailModalOpen, closeDetailModal]);

  useEffect(() => {
    if (selectedExpiration) {
      // Prefer sheet's assignedAssociate over notes' associateName
      const sheetAssociate = selectedExpiration.assignedAssociate;
      const hasSheetAssociate = sheetAssociate && sheetAssociate !== '-';
      const associateName = hasSheetAssociate ? sheetAssociate : (selectedExpiration.notes?.associateName || '');
      
      setFormData({
        associateName,
        stage: selectedExpiration.notes?.stage || '',
        status: selectedExpiration.notes?.status || '',
        priority: selectedExpiration.notes?.priority || '',
        followUps: selectedExpiration.notes?.followUps || [],
        remarks: selectedExpiration.notes?.remarks || '',
        internalNotes: selectedExpiration.notes?.internalNotes || '',
        tags: selectedExpiration.notes?.tags || [],
      });
      // Check if stage is a custom reason (not in predefined list)
      if (selectedExpiration.notes?.stage && !STAGES.includes(selectedExpiration.notes.stage)) {
        setCustomReason(selectedExpiration.notes.stage);
        setFormData(prev => ({ ...prev, stage: 'None of the Above' }));
      }
    }
  }, [selectedExpiration]);

  if (!selectedExpiration) return null;

  const handleSave = async () => {
    // Validate Current Status is filled
    if (!formData.status || formData.status.trim() === '') {
      alert('Please select a Current Status before saving.');
      return;
    }

    // Validate custom reason if "None of the Above" is selected
    if (formData.stage === 'None of the Above') {
      if (!customReason || customReason.trim() === '') {
        setShowCustomReasonError(true);
        alert('Please provide a custom reason for lapsing.');
        return;
      }
    }

    setIsSaving(true);
    setShowCustomReasonError(false);
    
    try {
      // Use custom reason if "None of the Above" is selected
      const dataToSave = {
        ...formData,
        stage: formData.stage === 'None of the Above' ? customReason : formData.stage,
      };
      
      await saveNote(selectedExpiration.uniqueId, dataToSave);
      closeDetailModal();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete all notes for this member?')) {
      try {
        await deleteNote(selectedExpiration.uniqueId);
        closeDetailModal();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleAddFollowUp = () => {
    // Validate Follow-Up Associate Name
    if (!newFollowUp.associateName || newFollowUp.associateName.trim() === '') {
      alert('Please select an Associate for this follow-up.');
      return;
    }

    // Validate Contacted On datetime
    if (!newFollowUp.contactedOn || newFollowUp.contactedOn.trim() === '') {
      alert('Please select the "Contacted On" date and time.');
      return;
    }

    if (newFollowUp.comment?.trim()) {
      const followUpEntry: FollowUpEntry = {
        date: new Date().toISOString().split('T')[0], // Auto-set current date
        comment: newFollowUp.comment,
        associateName: newFollowUp.associateName,
        contactedOn: newFollowUp.contactedOn,
        timestamp: new Date().toISOString(), // Auto-set current timestamp
      };

      setFormData({
        ...formData,
        followUps: [...(formData.followUps || []), followUpEntry],
      });

      setNewFollowUp({
        comment: '',
        contactedOn: '',
        associateName: '',
      });
    }
  };

  const handleDeleteFollowUp = (index: number) => {
    const updatedFollowUps = [...(formData.followUps || [])];
    updatedFollowUps.splice(index, 1);
    setFormData({ ...formData, followUps: updatedFollowUps });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  const tabs = [
    { id: 'info' as TabType, label: 'Member Info', icon: User },
    { id: 'tracking' as TabType, label: 'Tracking & Assignment', icon: TrendingUp },
    { id: 'followups' as TabType, label: 'Follow-Ups', icon: MessageSquare, count: formData.followUps?.length || 0 },
    { id: 'notes' as TabType, label: 'Notes & Details', icon: FileText },
  ];

  return (
    <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} size="full">
      <div className="flex flex-col h-full max-h-[98vh]">
        {/* Enhanced Header with member info */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white px-8 py-8 rounded-t-2xl shadow-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {selectedExpiration.firstName} {selectedExpiration.lastName}
              </h2>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-400" />
                  <span className="font-medium">{selectedExpiration.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span className="font-medium">Expires: {format(new Date(selectedExpiration.endDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-400" />
                  <span className="font-medium">{selectedExpiration.homeLocation}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <MemberStatusBadge status={selectedExpiration.status} size="lg" />
              <div className="text-right text-sm">
                <p className="text-slate-400 mb-1">Member ID</p>
                <p className="text-white font-bold text-lg">{selectedExpiration.memberId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="border-b border-gray-300 bg-gradient-to-r from-white to-gray-50 shadow-sm">
          <div className="flex px-8 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 relative rounded-t-xl border-2 border-b-0 ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg border-transparent transform -translate-y-0.5'
                      : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-bold">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`${
                      activeTab === tab.id 
                        ? 'bg-white/25 text-white border border-white/20' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    } text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center transition-all duration-200`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Member Info Tab */}
          {activeTab === 'info' && (
            <div className="p-8 space-y-6">
              {/* Member Profile Header Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User size={28} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">{selectedExpiration.firstName} {selectedExpiration.lastName}</h1>
                        <p className="text-blue-100 flex items-center gap-2 mt-1">
                          <Mail size={16} />
                          {selectedExpiration.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <MemberStatusBadge status={selectedExpiration.status} size="lg" />
                      <p className="text-blue-100 text-sm mt-2">Member ID: {selectedExpiration.memberId}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{formData.followUps?.length || 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Follow-ups</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.tags?.length || 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Tags</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedExpiration.paid === 'Yes' ? '✓' : '✗'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Payment</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.ceil((new Date(selectedExpiration.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Days to Expiry</p>
                    </div>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column - Personal & Contact */}
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <User size={20} className="text-blue-500" />
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Full Name</span>
                            <span className="text-gray-900 font-semibold">{selectedExpiration.firstName} {selectedExpiration.lastName}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Email Address</span>
                            <span className="text-gray-900">{selectedExpiration.email}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Member ID</span>
                            <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{selectedExpiration.memberId}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Home Location</span>
                            <span className="text-gray-900 flex items-center gap-1">
                              <MapPin size={14} className="text-orange-500" />
                              {selectedExpiration.homeLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-green-500" />
                          Current Status
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Follow-up Stage</span>
                            <div>
                              {formData.status ? (
                                <StatusBadge status={formData.status} size="sm" />
                              ) : (
                                <span className="text-gray-400 text-sm">Not set</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Priority Level</span>
                            <div>
                              {formData.priority ? (
                                <PriorityBadge priority={formData.priority} size="sm" />
                              ) : (
                                <span className="text-gray-400 text-sm">Auto-calculated</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Assigned To</span>
                            <span className="text-gray-900">
                              {(selectedExpiration.assignedAssociate && selectedExpiration.assignedAssociate !== '-') 
                                ? selectedExpiration.assignedAssociate 
                                : formData.associateName || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Membership & Financial */}
                    <div className="space-y-6">
                      {/* Membership Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <CreditCard size={20} className="text-purple-500" />
                          Membership Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Membership Type</span>
                            <span className="text-gray-900 font-semibold">{selectedExpiration.membershipName}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Expiration Date</span>
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <Calendar size={14} />
                              {format(new Date(selectedExpiration.endDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Order Date</span>
                            <span className="text-gray-900">{selectedExpiration.orderAt || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Sold By</span>
                            <span className="text-gray-900">{selectedExpiration.soldBy || 'N/A'}</span>
                          </div>
                          {selectedExpiration.revenue && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                              <span className="text-gray-600 font-medium">Revenue</span>
                              <span className="text-green-600 font-semibold">{selectedExpiration.revenue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account Status */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-indigo-500" />
                          Account Status
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Payment Status</span>
                            <span className={`font-semibold ${selectedExpiration.paid === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedExpiration.paid === 'Yes' ? '✅ Paid' : '❌ Unpaid'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Frozen Status</span>
                            <span className={`font-semibold ${selectedExpiration.frozen === 'Yes' ? 'text-blue-600' : 'text-gray-600'}`}>
                              {selectedExpiration.frozen === 'Yes' ? '🧊 Frozen' : '🔄 Active'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Usage Level</span>
                            <span className="text-gray-900">{selectedExpiration.currentUsage || 'No data'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Membership ID</span>
                            <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">{selectedExpiration.membershipId || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={() => setActiveTab('tracking')} 
                        variant="primary"
                        className="flex-1 min-w-[200px]"
                      >
                        <TrendingUp size={16} className="mr-2" />
                        Update Tracking
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('followups')} 
                        variant="outline"
                        className="flex-1 min-w-[200px]"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Add Follow-up
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('notes')} 
                        variant="outline"
                        className="flex-1 min-w-[200px]"
                      >
                        <FileText size={16} className="mr-2" />
                        Edit Notes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader icon={<User size={20} />} title="Personal Information" />
                    <CardBody>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Member ID</label>
                          <p className="text-lg font-bold text-gray-900 bg-white px-4 py-3 rounded-xl border-l-4 border-blue-500 shadow-sm">
                            {selectedExpiration.memberId}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                          <p className="text-lg font-bold text-gray-900 bg-white px-4 py-3 rounded-xl border-l-4 border-purple-500 shadow-sm">
                            {selectedExpiration.firstName} {selectedExpiration.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                          <p className="text-gray-900 bg-white px-4 py-3 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center gap-2">
                            <Mail size={16} className="text-green-500" />
                            <span className="font-medium">{selectedExpiration.email}</span>
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Membership Details */}
                  <Card>
                    <CardHeader icon={<CreditCard size={20} />} title="Membership Details" />
                    <CardBody>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Membership Type</label>
                          <p className="text-base font-bold text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl border border-blue-200 shadow-sm">
                            {selectedExpiration.membershipName}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Membership ID</label>
                            <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200">
                              {selectedExpiration.membershipId}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Order ID</label>
                            <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200">
                              {selectedExpiration.id}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">End Date</label>
                          <p className="text-base font-bold text-red-700 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3 rounded-xl border-l-4 border-red-500 shadow-sm flex items-center gap-2">
                            <Calendar size={18} className="text-red-500" />
                            {selectedExpiration.endDate}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Location & Additional Info */}
                  <Card>
                    <CardHeader icon={<MapPin size={20} />} title="Location & Details" />
                    <CardBody>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Home Location</label>
                          <p className="text-base font-medium text-gray-900 bg-white px-4 py-3 rounded-xl border-l-4 border-orange-500 shadow-sm flex items-center gap-2">
                            <MapPin size={18} className="text-orange-500" />
                            {selectedExpiration.homeLocation || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Order Date</label>
                            <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200">
                              {selectedExpiration.orderAt || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sold By</label>
                            <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1">
                              <Users size={14} className="text-gray-400" />
                              <span className="truncate">{selectedExpiration.soldBy || 'N/A'}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Current Usage</label>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200">
                            {selectedExpiration.currentUsage || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Status Indicators */}
                  <Card>
                    <CardHeader icon={<TrendingUp size={20} />} title="Status & Payment" />
                    <CardBody>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Payment Status</label>
                          <div className={`px-4 py-3 rounded-xl border-l-4 font-bold text-base shadow-sm ${
                            selectedExpiration.paid === 'Yes' 
                              ? 'text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' 
                              : 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
                          }`}>
                            {selectedExpiration.paid === 'Yes' ? '✓ Paid' : '✗ Unpaid'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Frozen Status</label>
                          <div className={`px-4 py-3 rounded-xl border-l-4 font-bold text-base shadow-sm ${
                            selectedExpiration.frozen === 'Yes' 
                              ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500' 
                              : 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-400'
                          }`}>
                            {selectedExpiration.frozen === 'Yes' ? '❄ Frozen' : '✓ Active'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Member Status</label>
                          <div className="flex">
                            <MemberStatusBadge status={selectedExpiration.status} size="lg" />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Tracking & Assignment Tab */}
          {activeTab === 'tracking' && (
            <div className="p-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <TrendingUp size={28} />
                    Tracking & Assignment Configuration
                  </h2>
                  <p className="text-green-100 mt-2">Configure member assignment, status tracking, and follow-up priorities</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assignment Configuration */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <Users size={20} className="text-blue-500" />
                        Assignment Details
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <Select
                            label="Assigned Associate"
                            options={ASSOCIATES}
                            value={formData.associateName || ''}
                            onChange={(value) => setFormData({ ...formData, associateName: value })}
                            placeholder="Select responsible associate..."
                            disabled={!!(selectedExpiration.assignedAssociate && selectedExpiration.assignedAssociate !== '-')}
                          />
                          {selectedExpiration.assignedAssociate && selectedExpiration.assignedAssociate !== '-' && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs text-amber-700">
                                ⚠️ This assignment is controlled by the system and cannot be modified here.
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <Select
                            label="Reason for Lapsing"
                            options={STAGES}
                            value={formData.stage || ''}
                            onChange={(value) => {
                              setFormData({ ...formData, stage: value });
                              if (value !== 'None of the Above') {
                                setCustomReason('');
                                setShowCustomReasonError(false);
                              }
                            }}
                            placeholder="Select primary reason..."
                          />
                          {formData.stage === 'None of the Above' && (
                            <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <Textarea
                                label="Custom Reason (Required)"
                                value={customReason}
                                onChange={(e) => {
                                  setCustomReason(e.target.value);
                                  setShowCustomReasonError(false);
                                }}
                                placeholder="Specify the exact reason for lapsing..."
                                rows={2}
                                className={showCustomReasonError ? 'border-red-500' : ''}
                              />
                              {showCustomReasonError && (
                                <p className="text-red-500 text-xs mt-1">Custom reason is required</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Configuration */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-500" />
                        Status & Priority
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <Select
                            label="Current Stage (Required)"
                            options={STATUSES}
                            value={formData.status || ''}
                            onChange={(value) => setFormData({ ...formData, status: value })}
                            placeholder="Select current follow-up stage..."
                            required
                          />
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-700">
                              📊 This indicates where the member is in your follow-up workflow
                            </p>
                          </div>
                        </div>

                        <div>
                          <Select
                            label="Priority Override"
                            options={PRIORITIES}
                            value={formData.priority || ''}
                            onChange={(value) => setFormData({ ...formData, priority: value })}
                            placeholder="Leave blank for auto-calculation..."
                          />
                          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-xs text-purple-700">
                              ⚡ Priority is auto-calculated based on expiration date. Override only for special cases.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Follow-Ups Tab */}
          {activeTab === 'followups' && (
            <div className="p-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <MessageSquare size={28} />
                    Follow-up Management
                  </h2>
                  <p className="text-indigo-100 mt-2">Track communication history and add new follow-up entries</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Add New Follow-Up */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <Plus size={20} className="text-green-500" />
                      Add New Follow-Up Entry
                    </h3>
                    
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Date & Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={newFollowUp.contactedOn || ''}
                            onChange={(e) => setNewFollowUp({ ...newFollowUp, contactedOn: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <Select
                            label="Associate Who Made Contact"
                            value={newFollowUp.associateName || ''}
                            onChange={(value) => setNewFollowUp({ ...newFollowUp, associateName: value })}
                            options={ASSOCIATES}
                            placeholder="Select associate..."
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Textarea
                          label="Follow-up Notes"
                          value={newFollowUp.comment || ''}
                          onChange={(e) => setNewFollowUp({ ...newFollowUp, comment: e.target.value })}
                          placeholder="Enter details about the conversation, member response, next steps..."
                          rows={4}
                        />
                      </div>
                      
                      <Button onClick={handleAddFollowUp} variant="primary" className="w-full">
                        <Plus size={16} className="mr-2" />
                        Add Follow-Up Entry
                      </Button>
                    </div>
                  </div>

                  {/* Follow-Up History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <Clock size={20} className="text-blue-500" />
                      Follow-Up History ({formData.followUps?.length || 0} entries)
                    </h3>
                    
                    {formData.followUps && formData.followUps.length > 0 ? (
                      <div className="space-y-4">
                        {formData.followUps.map((followUp, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {formData.followUps!.length - index}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {followUp.contactedOn ? format(new Date(followUp.contactedOn), 'MMM dd, yyyy HH:mm') : followUp.date}
                                  </p>
                                  {followUp.associateName && (
                                    <p className="text-sm text-gray-600">By {followUp.associateName}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteFollowUp(index)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <p className="text-gray-800 whitespace-pre-wrap">{followUp.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No follow-ups recorded yet</p>
                        <p className="text-sm">Add your first follow-up entry above to start tracking communication</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Details Tab */}
          {activeTab === 'notes' && (
            <div className="p-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FileText size={28} />
                    Notes & Documentation
                  </h2>
                  <p className="text-purple-100 mt-2">Manage member notes, tags, and additional information</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Notes Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <MessageSquare size={20} className="text-blue-500" />
                          Public Remarks
                        </h3>
                        <Textarea
                          label="Team-Shareable Notes"
                          value={formData.remarks || ''}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                          placeholder="Enter observations, preferences, or relevant information that can be shared with team members..."
                          rows={6}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText size={20} className="text-red-500" />
                          Internal Notes (Private)
                        </h3>
                        <Textarea
                          label="Confidential Information"
                          value={formData.internalNotes || ''}
                          onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                          placeholder="Enter sensitive information, payment issues, or confidential member details..."
                          rows={6}
                          helperText="� These notes are for management use only"
                        />
                      </div>
                    </div>

                    {/* Tags & Summary Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Tag size={20} className="text-green-500" />
                          Member Tags
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              label="Add Tag"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="e.g., high-value, loyal, price-sensitive..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button onClick={handleAddTag} variant="secondary" className="mt-6">
                              <Plus size={16} />
                            </Button>
                          </div>
                          
                          <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              {formData.tags && formData.tags.length > 0 ? (
                                formData.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                                  >
                                    {tag}
                                    <button
                                      onClick={() => handleRemoveTag(tag)}
                                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm italic">No tags added yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-orange-500" />
                          Status Summary
                        </h3>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">Current Stage</p>
                              {formData.status ? (
                                <StatusBadge status={formData.status} size="lg" />
                              ) : (
                                <p className="text-gray-400 text-sm">Not set</p>
                              )}
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">Priority</p>
                              {formData.priority ? (
                                <PriorityBadge priority={formData.priority} size="lg" />
                              ) : (
                                <p className="text-gray-400 text-sm">Auto-calc</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{formData.followUps?.length || 0}</p>
                              <p className="text-xs text-gray-500">Follow-ups</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{formData.tags?.length || 0}</p>
                              <p className="text-xs text-gray-500">Tags</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">
                                {(formData.remarks && formData.remarks.length > 0) || (formData.internalNotes && formData.internalNotes.length > 0) ? '✓' : '○'}
                              </p>
                              <p className="text-xs text-gray-500">Notes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer Actions */}
        <div className="border-t border-gray-300 px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-b-2xl flex items-center justify-between shadow-inner">
          <Button
            onClick={handleDelete}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 size={16} className="mr-2" />
            Delete All Notes
          </Button>
          <div className="flex gap-4">
            <Button 
              onClick={closeDetailModal} 
              variant="outline"
              className="px-6 py-2.5 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              loading={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
