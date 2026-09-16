import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';
import { PurchasePage } from './pages/PurchasePage';
import { SalesPage } from './pages/SalesPage';
import { TransferPage } from './pages/TransferPage';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { BentoAppLayout } from './layouts/BentoAppLayout';

function App() {
  return (
    <BrowserRouter>
      <BentoAppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/transfers" element={<TransferPage />} />
        </Routes>
      </BentoAppLayout>
    </BrowserRouter>
  );
}

export default App;
