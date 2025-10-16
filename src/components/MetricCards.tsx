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
      gradient: 'from-red-500 to-pink-500',
      iconColor: 'text-red-600',
    },
    {
      title: 'Upcoming Renewals',
      subtitle: '(Next 30 Days)',
      value: metrics.upcomingRenewals,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Lapsed Last Month',
      value: metrics.lapsedLastMonth,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Lapsed This Quarter',
      value: metrics.lapsedThisQuarter,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Upcoming Next Month',
      value: metrics.upcomingNextMonth,
      icon: CalendarClock,
      gradient: 'from-blue-500 to-purple-500',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} bg-opacity-10`}>
                <Icon className={card.iconColor} size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              {card.subtitle && (
                <p className="text-xs text-gray-400 mb-1">{card.subtitle}</p>
              )}
              <p className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
