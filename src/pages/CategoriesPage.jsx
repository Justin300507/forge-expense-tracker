import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../api';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
    const [dark, setDark] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await API.get('/categories');
                setCategories(response.data || []);
            } catch (err) {
                setError('Failed to fetch categories. Please try again later.');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <main className="ml-56 flex-1 p-6 overflow-auto">
                <Header dark={dark} setDark={setDark} />

                <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
                        <Link to="/categories/new" className="btn-primary">
                            Create New Category
                        </Link>
                    </div>

                    {loading ? (
                        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : categories.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400">No categories found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div key={category.id} className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{category.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">{category.description}</p>
                                    <div className="flex gap-3">
                                        <Link to={`/categories/${category.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
                                            View Details
                                        </Link>
                                        <Link to={`/categories/${category.id}/edit`} className="text-emerald-600 hover:text-emerald-800 text-sm">
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CategoriesPage;
