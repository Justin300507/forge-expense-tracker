import React from 'react';
import { BarChart2, Pencil, Trash2, DollarSign } from 'lucide-react';

const BudgetList = ({ budgets, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {budgets.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          <BarChart2 size={48} className="mx-auto mb-3" />
          <p>No budgets found. Create one to manage your spending!</p>
        </div>
      ) : (
        budgets.map(budget => (
          <div key={budget.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="text-emerald-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{budget.category_name} Budget</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-emerald-600">${budget.amount.toFixed(2)}</span>
              <button onClick={() => onEdit(budget)} className="text-slate-500 hover:text-emerald-600 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(budget.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BudgetList;
