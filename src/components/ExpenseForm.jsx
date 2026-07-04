import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { X } from 'lucide-react';

const ExpenseForm = ({ expense, categories, onSubmit, onCancel, loading }) => {
  const [description, setDescription] = React.useState(expense?.description || '');
  const [amount, setAmount] = React.useState(expense?.amount || '');
  const [categoryId, setCategoryId] = React.useState(expense?.category_id || '');
  const [date, setDate] = React.useState(expense?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...expense, description, amount: parseFloat(amount), category_id: parseInt(categoryId), date });
  };

  const isFormValid = description && amount && categoryId && date;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="description" className="text-xs font-medium text-slate-700 dark:text-slate-300">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Groceries, Dinner with friends"
              className="input"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="amount" className="text-xs font-medium text-slate-700 dark:text-slate-300">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 45.75"
              className="input"
            />
          </div>
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
            <label htmlFor="date" className="text-xs font-medium text-slate-700 dark:text-slate-300">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !isFormValid}>
              {loading ? <LoadingSpinner /> : (expense ? 'Save Changes' : 'Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
