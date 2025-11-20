import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-[60vw]',
  lg: 'max-w-[70vw]',
  xl: 'max-w-[80vw] min-h-[82vh]',
  xxl: 'max-w-[88vw] min-h-[90vh]',
  full: 'max-w-[95vw] min-h-[95vh]',
};

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div 
          className={`relative bg-white rounded-2xl modal-slim w-full portrait-narrow ${sizeClasses[size]} max-h-[94vh] animate-fadeIn border border-gray-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header with gradient */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-2xl">
            <h2 className="text-xl font-semibold text-slate-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-lg p-2"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Enhanced Content Area */}
          <div className="px-6 py-4 max-h-[calc(94vh-140px)] overflow-y-auto custom-scrollbar modal-content-dense">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
