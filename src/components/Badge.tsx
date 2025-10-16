import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'secondary' | 'purple' | 'orange';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200',
  warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200',
  info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-200',
  secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200',
  default: 'bg-gray-100 text-gray-700 border border-gray-300',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs w-20 h-5',
  md: 'px-3 py-1 text-xs w-24 h-6',
  lg: 'px-4 py-1.5 text-sm w-32 h-7',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '', size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-full shadow-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status?: string; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  if (!status) return <Badge variant="default" size={size}>No Status</Badge>;

  const variant = 
    status.toLowerCase() === 'active' ? 'success' :
    status.toLowerCase() === 'pending' ? 'warning' :
    status.toLowerCase() === 'completed' ? 'info' :
    status.toLowerCase() === 'cancelled' ? 'danger' :
    status.toLowerCase() === 'on hold' ? 'orange' : 'default';

  return <Badge variant={variant} size={size}>{status}</Badge>;
};

export const PriorityBadge: React.FC<{ priority?: string; size?: 'sm' | 'md' | 'lg' }> = ({ priority, size = 'md' }) => {
  if (!priority) return <Badge variant="default" size={size}>No Priority</Badge>;

  const variant = 
    priority.toLowerCase() === 'high' ? 'danger' :
    priority.toLowerCase() === 'medium' ? 'warning' :
    priority.toLowerCase() === 'low' ? 'info' : 'default';

  return <Badge variant={variant} size={size}>{priority}</Badge>;
};

export const MemberStatusBadge: React.FC<{ status?: string; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  if (!status) return null;
  
  const variant = 
    status.toLowerCase() === 'active' ? 'success' :
    status.toLowerCase() === 'frozen' ? 'info' :
    status.toLowerCase() === 'expired' ? 'danger' :
    status.toLowerCase() === 'churned' ? 'orange' : 'default';
  
  return <Badge variant={variant} size={size}>{status}</Badge>;
};
