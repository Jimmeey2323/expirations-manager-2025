import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
            {value || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-fadeIn">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center justify-between group ${
                  value === option ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
              >
                <span className={`text-sm ${value === option ? 'font-semibold' : 'font-medium'}`}>
                  {option}
                </span>
                {value === option && (
                  <Check size={16} className="text-primary-600" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface MultiSelectProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  values,
  onChange,
  options,
  placeholder = 'Select options',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className={values.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
            {values.length > 0 ? `${values.length} selected` : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-fadeIn">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggleOption(option)}
              className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center justify-between group ${
                values.includes(option) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
              }`}
            >
              <span className={`text-sm ${values.includes(option) ? 'font-semibold' : 'font-medium'}`}>
                {option}
              </span>
              {values.includes(option) && (
                <Check size={16} className="text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
