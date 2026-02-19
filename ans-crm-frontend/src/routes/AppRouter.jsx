import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminAllLeads from "../pages/admin/AllLeads";
import AdminAddLead from "../pages/admin/AdminAddLead";
import AdminTeam from "../pages/admin/Team";
import AdminReports from "../pages/admin/Reports";

import SalesDashboard from "../pages/sales/SalesDashboard";
import SalesMyLeads from "../pages/sales/MyLeads";
import SalesAddLead from "../pages/sales/AddLead";

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            user
              ? user.role === "admin"
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/sales/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute role="admin"><AdminAllLeads /></ProtectedRoute>} />
        <Route path="/admin/leads/new" element={<ProtectedRoute role="admin"><AdminAddLead /></ProtectedRoute>} />
        <Route path="/admin/team" element={<ProtectedRoute role="admin"><AdminTeam /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />

        <Route path="/sales/dashboard" element={<ProtectedRoute role="sales"><SalesDashboard /></ProtectedRoute>} />
        <Route path="/sales/leads" element={<ProtectedRoute role="sales"><SalesMyLeads /></ProtectedRoute>} />
        <Route path="/sales/leads/new" element={<ProtectedRoute role="sales"><SalesAddLead /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;