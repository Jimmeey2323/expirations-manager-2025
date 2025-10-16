import React, { useMemo } from 'react';
import { ExpirationWithNotes } from '../types';
import { 
  TrendingDown, 
  Calendar, 
  AlertCircle,
  Clock,
  CalendarClock
} from 'lucide-react';

interface MetricCardsProps {
  data: ExpirationWithNotes[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ data }) => {
  const metrics = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Helper to get start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Helper to get start and end of last month
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0);
    
    // Helper to get start of quarter
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const startOfQuarter = new Date(currentYear, quarterStartMonth, 1);
    
    // Helper to get next month range
    const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
    const endOfNextMonth = new Date(currentYear, currentMonth + 2, 0);
    
    // Calculate metrics
    const lapsedThisMonth = data.filter(item => {
      const endDate = new Date(item.endDate);
      return endDate >= startOfMonth && endDate <= endOfMonth && endDate < now;
    }).length;
    
    const upcomingRenewals = data.filter(item => {
      const endDate = new Date(item.endDate);
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;
    
    const lapsedLastMonth = data.filter(item => {
      const endDate = new Date(item.endDate);
      return endDate >= startOfLastMonth && endDate <= endOfLastMonth;
    }).length;
    
    const lapsedThisQuarter = data.filter(item => {
      const endDate = new Date(item.endDate);
      return endDate >= startOfQuarter && endDate < now;
    }).length;
    
    const upcomingNextMonth = data.filter(item => {
      const endDate = new Date(item.endDate);
      return endDate >= startOfNextMonth && endDate <= endOfNextMonth;
    }).length;
    
    return {
      lapsedThisMonth,
      upcomingRenewals,
      lapsedLastMonth,
      lapsedThisQuarter,
      upcomingNextMonth,
    };
  }, [data]);

  const cards = [
    {
      title: 'Lapsed This Month',
      value: metrics.lapsedThisMonth,
      icon: TrendingDown,
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
    },
    {
      title: 'Upcoming Renewals',
      subtitle: '(Next 30 Days)',
      value: metrics.upcomingRenewals,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Lapsed Last Month',
      value: metrics.lapsedLastMonth,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Lapsed This Quarter',
      value: metrics.lapsedThisQuarter,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
    },
    {
      title: 'Upcoming Next Month',
      value: metrics.upcomingNextMonth,
      icon: CalendarClock,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgLight} rounded-xl p-5 border-2 border-${card.textColor.replace('text-', '')}-200 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 mb-2">{card.subtitle}</p>
                )}
                <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className={card.textColor} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
