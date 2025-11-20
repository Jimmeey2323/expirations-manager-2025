import React from 'react';
import { Modal } from './Modal';
import { ExpirationWithNotes } from '../types';
import { formatDateIST } from '../utils/dateFormat';
import { MessageSquare, Calendar, User } from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  expiration: ExpirationWithNotes | null;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  expiration,
}) => {
  if (!expiration) return null;

  const followUps = expiration.notes?.followUps || [];
  
  // Sort by date descending
  const sortedFollowUps = [...followUps].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col min-h-[72vh]">
        {/* Header (sleeker) */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Follow-up History</h2>
              <p className="text-sm text-gray-500">
                {expiration.firstName} {expiration.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {sortedFollowUps.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No follow-ups recorded</p>
              <p className="text-gray-500 text-sm mt-2">
                Open the detail modal to add follow-ups
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFollowUps.map((followUp, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {followUp.associateName || 'Unknown'}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-gray-500 mt-0.5">
                          {followUp.contactedOn && (
                            <div className="flex items-center gap-2">
                              <Calendar size={12} />
                              <span className="font-medium text-gray-700">Contacted: {new Date(followUp.contactedOn).toLocaleString('en-IN', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span className="text-gray-500">Logged: {formatDateIST(followUp.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                      #{sortedFollowUps.length - idx}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-black text-sm leading-relaxed">
                      {followUp.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white text-gray-800 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
