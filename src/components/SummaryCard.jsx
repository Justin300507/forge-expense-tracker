import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ label, value, percentageChange, icon: Icon, trend }) => {
  const trendColorClass = trend === 'up' ? 'text-emerald-600' : 'text-red-500';
  const trendIcon = trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
          <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {percentageChange && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trendColorClass}`}>
          {trendIcon} {percentageChange}
        </p>
      )}
    </div>
  );
};

export default SummaryCard;
