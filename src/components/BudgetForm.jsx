import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { X } from 'lucide-react';

const BudgetForm = ({ budget, categories, onSubmit, onCancel, loading }) => {
  const [amount, setAmount] = React.useState(budget?.amount || '');
  const [categoryId, setCategoryId] = React.useState(budget?.category_id || '');
  const [month, setMonth] = React.useState(budget?.month || new Date().getMonth() + 1);
  const [year, setYear] = React.useState(budget?.year || new Date().getFullYear());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...budget, amount: parseFloat(amount), category_id: parseInt(categoryId), month: parseInt(month), year: parseInt(year) });
  };

  const isFormValid = amount && categoryId && month && year;

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{budget ? 'Edit Budget' : 'Create New Budget'}</h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="category" className="text-xs font-medium text-slate-700 dark:text-slate-300">Category</label>
            <select
              id="category"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="amount" className="text-xs font-medium text-slate-700 dark:text-slate-300">Budget Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 500.00"
              className="input"
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <label htmlFor="month" className="text-xs font-medium text-slate-700 dark:text-slate-300">Month</label>
              <select
                id="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="input"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="year" className="text-xs font-medium text-slate-700 dark:text-slate-300">Year</label>
              <select
                id="year"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="input"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !isFormValid}>
              {loading ? <LoadingSpinner /> : (budget ? 'Save Changes' : 'Create Budget')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
