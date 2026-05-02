
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Setup } from './pages/Setup';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Scrap } from './pages/Scrap';
import { Maintenance } from './pages/Maintenance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Actions } from './pages/Actions';

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/scrap" element={<Scrap />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
