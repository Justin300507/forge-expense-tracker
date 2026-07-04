import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch profile data. Please log in again.');
        console.error('Error fetching profile:', err);
        if (err.response && err.response.status === 401) {
          ['token', 'display_name', 'user_id', 'user_email'].forEach(k => localStorage.removeItem(k));
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="ml-56 flex-1 p-6 overflow-auto">
        <Header dark={dark} setDark={setDark} />

        <div className="py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile</h1>

          {loading ? (
            <div className="animate-pulse h-48 bg-slate-200 dark:bg-slate-700 rounded-xl max-w-md" />
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : !user ? (
            <p className="text-slate-500 dark:text-slate-400">No user data found.</p>
          ) : (
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 p-6 max-w-md space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">ID</label>
                <p className="text-slate-900 dark:text-white">{user.id}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <p className="text-slate-900 dark:text-white">{user.email}</p>
              </div>
              {user.display_name && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Display Name</label>
                  <p className="text-slate-900 dark:text-white">{user.display_name}</p>
                </div>
              )}
              {user.role && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role</label>
                  <p className="text-slate-900 dark:text-white">{user.role}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
