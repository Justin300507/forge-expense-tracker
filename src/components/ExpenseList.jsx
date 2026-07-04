import React from 'react';
import { Receipt, Wallet, CreditCard, DollarSign, Pencil, Trash2 } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'food': return <Wallet className="text-emerald-600" size={18} />;
      case 'transportation': return <CreditCard className="text-emerald-600" size={18} />;
      case 'entertainment': return <Receipt className="text-emerald-600" size={18} />;
      default: return <DollarSign className="text-emerald-600" size={18} />;
    }
  };

  return (
    <div className="space-y-3">
      {expenses.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          <Receipt size={48} className="mx-auto mb-3" />
          <p>No expenses found.</p>
        </div>
      ) : (
        expenses.map(expense => (
          <div key={expense.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                {getCategoryIcon(expense.category_name || 'Other')}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{expense.description || 'No description'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{expense.category_name} · {new Date(expense.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-red-500">-${expense.amount.toFixed(2)}</span>
              <button onClick={() => onEdit(expense)} className="text-slate-500 hover:text-emerald-600 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(expense.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
