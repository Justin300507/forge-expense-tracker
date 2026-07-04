import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BudgetsPage = () => {
    const [dark, setDark] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await API.get('/budgets');
                setBudgets(response.data || []);
            } catch (err) {
                setError('Failed to fetch budgets. Please try again.');
                toast.error('Failed to fetch budgets.');
                console.error('Error fetching budgets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await API.delete(`/budgets/${id}`);
                setBudgets(budgets.filter(budget => budget.id !== id));
                toast.success('Budget deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete budget.');
                console.error('Error deleting budget:', err);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <main className="ml-56 flex-1 p-6 overflow-auto">
                <Header dark={dark} setDark={setDark} />

                <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</h1>
                        <button onClick={() => navigate('/budgets/new')} className="btn-primary">
                            Create New Budget
                        </button>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : budgets.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400">No budgets found. Start by creating a new one!</p>
                    ) : (
                        <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Period</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.map((budget) => (
                                        <tr key={budget.id} className="border-t border-slate-100 dark:border-slate-700">
                                            <td className="px-5 py-4 text-sm text-slate-900 dark:text-white">{budget.category_name ?? budget.category_id}</td>
                                            <td className="px-5 py-4 text-sm text-slate-900 dark:text-white">${Number(budget.amount).toFixed(2)}</td>
                                            <td className="px-5 py-4 text-sm text-slate-900 dark:text-white">
                                                {budget.month && budget.year
                                                    ? `${budget.month}/${budget.year}`
                                                    : budget.start_date
                                                        ? `${new Date(budget.start_date).toLocaleDateString()} - ${new Date(budget.end_date).toLocaleDateString()}`
                                                        : '—'}
                                            </td>
                                            <td className="px-5 py-4 text-sm">
                                                <button
                                                    onClick={() => navigate(`/budgets/edit/${budget.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-800 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(budget.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BudgetsPage;
