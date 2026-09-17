import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';
import { PurchasePage } from './pages/PurchasePage';
import { SalesPage } from './pages/SalesPage';
import { TransferPage } from './pages/TransferPage';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { LoginPage } from './pages/LoginPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { BentoAppLayout } from './layouts/BentoAppLayout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Role } from './types/auth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes with Bento Layout */}
          <Route path="/" element={<ProtectedRoute><BentoAppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="purchases" element={<PurchasePage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="transfers" element={<TransferPage />} />
            
            {/* Admin Only Route */}
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
