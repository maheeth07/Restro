import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageRestaurants from './pages/ManageRestaurants';
import ManageBranches from './pages/ManageBranches';
import ManageMenu from './pages/ManageMenu';
import ManageTables from './pages/ManageTables';
import LiveOrders from './pages/LiveOrders';
import StaffManagement from './pages/StaffManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Public Customer Page //
import CustomerMenu from './pages/CustomerMenu';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Customer Route (No Login Required) */}
        <Route path="/menu/:branchId" element={<CustomerMenu />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="restaurants" element={<ManageRestaurants />} />
          <Route path="branches" element={<ManageBranches />} />
          <Route path="menus" element={<ManageMenu />} />
          <Route path="tables" element={<ManageTables />} />
          <Route path="orders" element={<LiveOrders />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
