import React from 'react';
import { Wallet, Pencil, Trash2 } from 'lucide-react';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {categories.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          <Wallet size={48} className="mx-auto mb-3" />
          <p>No categories found. Add one to get started!</p>
        </div>
      ) : (
        categories.map(category => (
          <div key={category.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <Wallet className="text-emerald-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onEdit(category)} className="text-slate-500 hover:text-emerald-600 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(category.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryList;
