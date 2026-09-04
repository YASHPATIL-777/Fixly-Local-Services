import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import TechniciansPage from './pages/TechniciansPage';
import TechnicianDetailPage from './pages/TechnicianDetailPage';
import CreateRequestPage from './pages/CreateRequestPage';
import CustomerRequestsPage from './pages/CustomerRequestsPage';
import TechnicianRequestsPage from './pages/TechnicianRequestsPage';
import RequestDetailPage from './pages/RequestDetailPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTechniciansPage from './pages/AdminTechniciansPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ChatPage from './pages/ChatPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
          <Routes>
            {/* Public Marketplace Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/technicians" element={<TechniciansPage />} />
            <Route path="/technicians/:id" element={<TechnicianDetailPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Phase 4 Booking & Requests Routes */}
            <Route 
              path="/request-service/:technicianId" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CreateRequestPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/requests" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerRequestsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/requests/:id" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <RequestDetailPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/requests/:id/chat" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/bookings/:requestId/chat" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />

            {/* Technician Phase 4 Requests Management Routes */}
            <Route 
              path="/technician/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/technician/requests" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianRequestsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/technician/requests/:id" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <RequestDetailPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/technician/requests/:id/chat" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/technician/jobs/:requestId/chat" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />

            {/* Shared Messages & Conversations Inbox Route */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'technician']}>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Management Routes (Phase 8) */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/technicians" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTechniciansPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/services" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRequestsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reviews" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReviewsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}
