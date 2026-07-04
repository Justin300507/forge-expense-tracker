import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch profile data. Please log in again.');
        console.error('Error fetching profile:', err);
        // Optionally redirect to login if token is invalid
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-4">No user data found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
          <p className="text-gray-900 text-lg">{user.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900 text-lg">{user.email}</p>
        </div>
        {user.display_name && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Display Name:</label>
            <p className="text-gray-900 text-lg">{user.display_name}</p>
          </div>
        )}
        {user.role && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
            <p className="text-gray-900 text-lg">{user.role}</p>
          </div>
        )}
        {/* Add more profile fields as needed based on your User schema */}
      </div>
    </div>
  );
};

export default ProfilePage;
