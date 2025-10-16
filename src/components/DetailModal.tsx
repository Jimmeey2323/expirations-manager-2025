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

type TabType = 'info' | 'followups' | 'notes';

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
      setFormData({
        associateName: selectedExpiration.notes?.associateName || '',
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
    // Validate Associate Name is filled
    if (!formData.associateName || formData.associateName.trim() === '') {
      alert('Please select an Assigned Associate before saving.');
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
    // Validate Associate Name
    if (!formData.associateName || formData.associateName.trim() === '') {
      alert('Please select an Assigned Associate before adding a follow-up.');
      return;
    }

    if (newFollowUp.comment?.trim()) {
      const followUpEntry: FollowUpEntry = {
        date: new Date().toISOString().split('T')[0], // Auto-set current date
        comment: newFollowUp.comment,
        associateName: newFollowUp.associateName || formData.associateName || '',
        timestamp: new Date().toISOString(), // Auto-set current timestamp
      };

      setFormData({
        ...formData,
        followUps: [...(formData.followUps || []), followUpEntry],
      });

      setNewFollowUp({
        comment: '',
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
    { id: 'followups' as TabType, label: 'Follow-Ups', icon: MessageSquare, count: formData.followUps?.length || 0 },
    { id: 'notes' as TabType, label: 'Notes & Details', icon: FileText },
  ];

  return (
    <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} size="lg">
      <div className="flex flex-col h-full max-h-[95vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white px-6 py-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {selectedExpiration.firstName} {selectedExpiration.lastName}
              </h2>
              <p className="text-slate-300 flex items-center gap-2">
                <Mail size={14} />
                {selectedExpiration.email}
              </p>
            </div>
            <MemberStatusBadge status={selectedExpiration.status} size="lg" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex px-6 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative rounded-t-xl ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 border-2 border-gray-300 border-b-0 hover:border-gray-400'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'} text-xs font-bold px-2 py-0.5 rounded-full`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Member Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* Tracking & Assignment - Full Width */}
              <Card>
                <CardHeader icon={<TrendingUp size={20} />} title="Tracking & Assignment" />
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Assigned Associate"
                      options={ASSOCIATES}
                      value={formData.associateName || ''}
                      onChange={(value) => setFormData({ ...formData, associateName: value })}
                      placeholder="Select associate..."
                      required
                    />
                    <div>
                      <Select
                        label="Reasons for Lapsing"
                        options={STAGES}
                        value={formData.stage || ''}
                        onChange={(value) => {
                          setFormData({ ...formData, stage: value });
                          if (value !== 'None of the Above') {
                            setCustomReason('');
                            setShowCustomReasonError(false);
                          }
                        }}
                        placeholder="Select reason..."
                      />
                      {formData.stage === 'None of the Above' && (
                        <div className="mt-2">
                          <Textarea
                            label="Custom Reason (Required)"
                            value={customReason}
                            onChange={(e) => {
                              setCustomReason(e.target.value);
                              setShowCustomReasonError(false);
                            }}
                            placeholder="Please specify the reason for lapsing..."
                            rows={2}
                            className={showCustomReasonError ? 'border-red-500' : ''}
                          />
                          {showCustomReasonError && (
                            <p className="text-red-500 text-xs mt-1">Custom reason is required</p>
                          )}
                        </div>
                      )}
                    </div>
                    <Select
                      label="Current Stage"
                      options={STATUSES}
                      value={formData.status || ''}
                      onChange={(value) => setFormData({ ...formData, status: value })}
                      placeholder="Select stage..."
                    />
                    <Select
                      label="Priority"
                      options={PRIORITIES}
                      value={formData.priority || ''}
                      onChange={(value) => setFormData({ ...formData, priority: value })}
                      placeholder="Select priority..."
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Follow-Ups Tab */}
          {activeTab === 'followups' && (
            <div className="space-y-4">
              {/* Add New Follow-Up */}
              <Card>
                <CardHeader icon={<Plus size={20} />} title="Add New Follow-Up" />
                <CardBody>
                  <div className="space-y-3">
                    <Select
                      label="Associate"
                      value={newFollowUp.associateName || ''}
                      onChange={(value) => setNewFollowUp({ ...newFollowUp, associateName: value })}
                      options={ASSOCIATES}
                      placeholder="Select associate or leave blank to use assigned"
                    />
                    <Textarea
                      label="Follow-Up Comment"
                      value={newFollowUp.comment || ''}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, comment: e.target.value })}
                      placeholder="Enter follow-up details, conversation notes, action items..."
                      rows={3}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>Date and time will be recorded automatically when you add this follow-up</span>
                    </div>
                    <Button onClick={handleAddFollowUp} variant="primary" className="w-full">
                      <Plus size={16} className="mr-2" />
                      Add Follow-Up Entry
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Follow-Up History */}
              <Card>
                <CardHeader icon={<Clock size={20} />} title={`Follow-Up History (${formData.followUps?.length || 0})`} />
                <CardBody>
                  {formData.followUps && formData.followUps.length > 0 ? (
                    <div className="space-y-3">
                      {formData.followUps.map((followUp, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-800 rounded-xl p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white px-3 py-1 rounded-full text-xs font-bold">
                                #{formData.followUps!.length - index}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <Calendar size={14} />
                                  {followUp.date}
                                </p>
                                {followUp.associateName && (
                                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                    <User size={12} />
                                    {followUp.associateName}
                                  </p>
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
                          <p className="text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-xl border border-blue-100">
                            {followUp.comment}
                          </p>
                          {followUp.timestamp && (
                            <p className="text-xs text-gray-500 mt-2">
                              Added: {format(new Date(followUp.timestamp), 'MMM dd, yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>No follow-ups recorded yet</p>
                      <p className="text-sm">Add your first follow-up entry above</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {/* Notes & Details Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Remarks */}
              <Card>
                <CardHeader icon={<MessageSquare size={20} />} title="Remarks" />
                <CardBody>
                  <Textarea
                    label="Public Remarks"
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter any public-facing remarks or notes..."
                    rows={4}
                  />
                </CardBody>
              </Card>

              {/* Internal Notes */}
              <Card>
                <CardHeader icon={<FileText size={20} />} title="Internal Notes" />
                <CardBody>
                  <Textarea
                    label="Internal Notes (Private)"
                    value={formData.internalNotes || ''}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                    placeholder="Enter internal notes, observations, or private information..."
                    rows={4}
                    helperText="These notes are for internal use only"
                  />
                </CardBody>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader icon={<Tag size={20} />} title="Tags" />
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        label="Add Tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter tag name..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button onClick={handleAddTag} variant="secondary" className="mt-6">
                        <Plus size={16} className="mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags && formData.tags.length > 0 ? (
                        formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md"
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
                        <p className="text-gray-500 text-sm">No tags added</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Status Summary */}
              <Card>
                <CardHeader icon={<TrendingUp size={20} />} title="Status Summary" />
                <CardBody>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-300">
                      <p className="text-sm text-gray-700 font-medium mb-1">Current Stage</p>
                      {formData.status ? (
                        <StatusBadge status={formData.status} size="lg" />
                      ) : (
                        <p className="text-gray-500 text-sm">Not set</p>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-300">
                      <p className="text-sm text-gray-700 font-medium mb-1">Priority Level</p>
                      {formData.priority ? (
                        <PriorityBadge priority={formData.priority} size="lg" />
                      ) : (
                        <p className="text-gray-500 text-sm">Auto-calculated</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white rounded-b-xl flex items-center justify-between">
          <Button
            onClick={handleDelete}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Delete All Notes
          </Button>
          <div className="flex gap-3">
            <Button onClick={closeDetailModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              loading={isSaving}
              className="shadow-lg"
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
