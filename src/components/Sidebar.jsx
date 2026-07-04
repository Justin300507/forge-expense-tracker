import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, BarChart2, User, DollarSign } from 'lucide-react';

const Sidebar = () => {
  const navClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-800 text-white'
      : 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-emerald-300 hover:bg-emerald-900 hover:text-white';

  return (
    <aside className="w-56 bg-emerald-950 text-emerald-100 flex flex-col px-3 py-4 fixed h-full">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">E</span>
        </div>
        <span className="font-bold text-white text-sm">ExpenseTracker</span>
      </div>
      <nav className="flex-1 space-y-0.5">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/expenses" className={navClass}>
          <Receipt size={16} /> Expenses
        </NavLink>
        <NavLink to="/categories" className={navClass}>
          <Wallet size={16} /> Categories
        </NavLink>
        <NavLink to="/budgets" className={navClass}>
          <BarChart2 size={16} /> Budgets
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          <User size={16} /> Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
