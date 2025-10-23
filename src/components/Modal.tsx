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
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  xxl: 'max-w-7xl',
  full: 'max-w-[95vw]',
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
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} min-h-[80vh] max-h-[95vh] animate-fadeIn border border-gray-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header with gradient */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-2xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-gray-800 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-xl p-2"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Enhanced Content Area */}
          <div className="px-8 py-6 max-h-[calc(95vh-180px)] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
