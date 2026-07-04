import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import SpendingChart from '../components/SpendingChart';
import ExpenseList from '../components/ExpenseList';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../api';
import { parseError, sleep } from '../utils/helpers';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';

const DashboardPage = () => {
  const [dark, setDark] = React.useState(false);
  const [summaryStats, setSummaryStats] = React.useState(null);
  const [recentExpenses, setRecentExpenses] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      setStatus(null);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          setStatus(attempt === 1 ? 'Loading dashboard...' : `Waking up the server... retrying (${attempt}/3)`);
          const statsRes = await API.get('/stats/summary');
          setSummaryStats(statsRes.data);

          const expensesRes = await API.get('/expenses?limit=5');
          setRecentExpenses(expensesRes.data.items || []);

          // Mock chart data for now, replace with actual API if available
          const mockChartData = [
            { month: 'Jan', total: 840 },
            { month: 'Feb', total: 720 },
            { month: 'Mar', total: 1100 },
            { month: 'Apr', total: 890 },
            { month: 'May', total: 1240 },
            { month: 'Jun', total: 980 },
          ];
          setChartData(mockChartData);

          setLoading(false);
          setStatus(null);
          return;
        } catch (err) {
          const msg = parseError(err);
          if (msg) { setError(msg); setStatus(null); setLoading(false); return; } // real API error, don't retry
          if (attempt < 3) { setStatus(`Backend starting up... retrying in 15s (${attempt}/3)`); await sleep(15000); }
        }
      }
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
      setStatus(null);
    };

    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="ml-56 flex-1 p-6 overflow-auto">
        <Header dark={dark} setDark={setDark} />

        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{today}</p>
            </div>
          </div>

          {status && <p className="text-sm text-emerald-600 text-center mb-4">{status}</p>}
      {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                ))}
              </div>
              <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  label="Total Spent (This Month)"
                  value={`$${summaryStats?.total_spent_this_month?.toFixed(2) || '0.00'}`}
                  icon={DollarSign}
                  percentageChange="+5.2% vs last month"
                  trend="up"
                />
                <SummaryCard
                  label="Budget Remaining"
                  value={`$${summaryStats?.budget_remaining?.toFixed(2) || '0.00'}`}
                  icon={Wallet}
                  percentageChange="-2.1% vs last month"
                  trend="down"
                />
                <SummaryCard
                  label="Total Expenses"
                  value={summaryStats?.total_expenses_this_month || '0'}
                  icon={Receipt}
                  percentageChange="+8.2% vs last month"
                  trend="up"
                />
                <SummaryCard
                  label="Categories Used"
                  value={summaryStats?.categories_used_this_month || '0'}
                  icon={BarChart2}
                  percentageChange="N/A"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingChart data={chartData} />
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Expenses</h3>
                  <ExpenseList expenses={recentExpenses} onEdit={() => {}} onDelete={() => {}} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
