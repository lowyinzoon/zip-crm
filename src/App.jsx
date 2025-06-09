import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TechnicianView from './pages/TechnicianView'
import CustomerView from './pages/CustomerView'
import Inventory from './pages/Inventory'
import AdminJobHistory from './pages/AdminJobHistory'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowed={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowed={['tech']}>
            <TechnicianView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowed={['customer']}>
            <CustomerView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowed={['admin']}>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-jobs"
        element={
          <ProtectedRoute allowed={['admin']}>
            <AdminJobHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App 