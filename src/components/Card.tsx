import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false 
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg ${
        hover ? 'hover:shadow-2xl transition-shadow duration-300' : ''
      } ${
        gradient ? 'border-t-4 border-primary-500' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, title, className = '', icon }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-blue-600">{icon}</div>}
        {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};
