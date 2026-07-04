import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await API.get('/categories');
                setCategories(response.data.items);
            } catch (err) {
                setError('Failed to fetch categories. Please try again later.');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="container mx-auto p-4">Loading categories...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <Link to="/categories/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Create New Category
            </Link>
            {
                categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                                <p className="text-gray-600 mb-4">{category.description}</p>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/categories/${category.id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/categories/${category.id}/edit`}
                                        className="text-green-500 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
};

export default CategoriesPage;
