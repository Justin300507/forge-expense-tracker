import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { X } from 'lucide-react';

const CategoryForm = ({ category, onSubmit, onCancel, loading }) => {
  const [name, setName] = React.useState(category?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...category, name });
  };

  const isFormValid = name.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{category ? 'Edit Category' : 'Add New Category'}</h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-medium text-slate-700 dark:text-slate-300">Category Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Food, Transportation, Utilities"
              className="input"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !isFormValid}>
              {loading ? <LoadingSpinner /> : (category ? 'Save Changes' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
