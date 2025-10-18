import React, { useMemo } from 'react';
import { ExpirationWithNotes } from '../types';
import { 
  TrendingDown, 
  Calendar, 
  AlertCircle,
  Clock,
  CalendarClock,
  DollarSign
} from 'lucide-react';

interface MetricCardsProps {
  data: ExpirationWithNotes[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ data }) => {
  // Format large numbers with L/Cr/K notation
  const formatRevenue = (amount: number): string => {
    if (amount >= 10000000) {
      // Crores (1 Cr = 10,000,000)
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      // Lakhs (1 L = 100,000)
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      // Thousands (1 K = 1,000)
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toFixed(1)}`;
    }
  };

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
    
    // Calculate total revenue projection
    const totalRevenue = data.reduce((sum, item) => {
      const revenue = parseFloat(item.revenue || '0');
      return sum + (isNaN(revenue) ? 0 : revenue);
    }, 0);
    
    return {
      lapsedThisMonth,
      upcomingRenewals,
      lapsedLastMonth,
      lapsedThisQuarter,
      upcomingNextMonth,
      totalRevenue,
    };
  }, [data]);

  const cards = [
    {
      title: 'Revenue Projection',
      value: formatRevenue(metrics.totalRevenue),
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      isRevenue: true,
    },
    {
      title: 'Lapsed This Month',
      value: metrics.lapsedThisMonth,
      icon: TrendingDown,
      gradient: 'from-red-500 to-pink-500',
    },
    {
      title: 'Upcoming Renewals',
      subtitle: '(Next 30 Days)',
      value: metrics.upcomingRenewals,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Lapsed Last Month',
      value: metrics.lapsedLastMonth,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Lapsed This Quarter',
      value: metrics.lapsedThisQuarter,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Upcoming Next Month',
      value: metrics.upcomingNextMonth,
      icon: CalendarClock,
      gradient: 'from-blue-500 to-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-transparent overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.gradient} shadow-sm`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 h-8">
                  {card.title}
                </p>
                <div className="h-4 mb-2">
                  {card.subtitle && (
                    <p className="text-xs text-gray-400">{card.subtitle}</p>
                  )}
                </div>
                <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent leading-none`}>
                  {card.value}
                </p>
              </div>
            </div>
            
            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </div>
        );
      })}
    </div>
  );
};
