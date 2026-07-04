import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../api';
import { parseError, sleep } from '../utils/helpers';
import { Plus, Search, Receipt, X } from 'lucide-react';

const ExpensesPage = () => {
  const [dark, setDark] = React.useState(false);
  const [expenses, setExpenses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [toast, setToast] = React.useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toastColorClass = toast && toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600';

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    setError(null);
    setStatus(null);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        setStatus(attempt === 1 ? 'Loading expenses...' : `Waking up the server... retrying (${attempt}/3)`);
        const params = {
          page,
          limit: 10,
          ...(searchQuery && { search: searchQuery }),
          ...(filterCategory && { category_id: filterCategory }),
        };
        const res = await API.get('/expenses', { params });
        setExpenses(res.data.items || []);
        setTotalPages(Math.ceil(res.data.total / 10));
        setCurrentPage(page);
        setLoading(false);
        setStatus(null);
        return;
      } catch (err) {
        const msg = parseError(err);
        if (msg) { setError(msg); setStatus(null); setLoading(false); return; } // real API error, don't retry
        if (attempt < 3) { setStatus(`Backend starting up... retrying in 15s (${attempt}/3)`); await sleep(15000); }
      }
    }
    setError('Failed to load expenses. Please try again later.');
    setLoading(false);
    setStatus(null);
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data.items || []);
    } catch (err) {
      showToast('Failed to load categories.', 'error');
    }
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchExpenses(1); // Reset to page 1 on search/filter change
  }, [searchQuery, filterCategory]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSubmit = async (expenseData) => {
    setLoading(true);
    try {
      if (editingExpense) {
        await API.put(`/expenses/${editingExpense.id}`, expenseData);
        showToast('Expense updated successfully!');
      } else {
        await API.post('/expenses', expenseData);
        showToast('Expense added successfully!');
      }
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses(currentPage);
    } catch (err) {
      showToast(parseError(err) || 'Failed to save expense.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setLoading(true);
    try {
      await API.delete(`/expenses/${id}`);
      showToast('Expense deleted successfully!');
      fetchExpenses(currentPage);
    } catch (err) {
      showToast(parseError(err) || 'Failed to delete expense.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterCategory === '' || expense.category_id === parseInt(filterCategory))
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="ml-56 flex-1 p-6 overflow-auto">
        <Header dark={dark} setDark={setDark} />

        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h1>
            <button onClick={handleAddExpense} className="btn-primary flex items-center gap-1.5">
              <Plus size={16} /> Add Expense
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {status && <p className="text-sm text-emerald-600 text-center mb-4">{status}</p>}
      {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <ExpenseList expenses={filteredExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
          )}

          {!loading && !error && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={fetchExpenses} />}
        </div>

        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        )}

        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-50 ${toastColorClass}`}>
            {toast.msg}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpensesPage;
