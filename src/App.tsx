/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Reports } from '@/pages/Reports';
import { UserManagement } from '@/pages/UserManagement';
import { StudentDataPage } from '@/pages/StudentData';
import { Recap } from '@/pages/Recap';
import { CreateReport } from '@/pages/CreateReport';
import { ReportHistory } from '@/pages/ReportHistory';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/app/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
            <Route path="/app/students" element={<DashboardLayout><StudentDataPage /></DashboardLayout>} />
          </Route>

          {/* Admin & Guru Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'guru']} />}>
            <Route path="/app/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path="/app/recap" element={<DashboardLayout><Recap /></DashboardLayout>} />
          </Route>

          {/* Siswa Routes */}
          <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
            <Route path="/app/create-report" element={<DashboardLayout><CreateReport /></DashboardLayout>} />
            <Route path="/app/history" element={<DashboardLayout><ReportHistory /></DashboardLayout>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}
