import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BudgetsPage from './pages/BudgetsPage'
import CategoriesPage from './pages/CategoriesPage'
import ProfilePage from './pages/ProfilePage'
import NewPage from './pages/NewPage'

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/login" replace />

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />

        <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        <Route path="/categories/new" element={<PrivateRoute><NewPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
