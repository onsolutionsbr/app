import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPayments from './pages/admin/Payments';
import CategoryDetails from './pages/services/CategoryDetails';
import BookService from './pages/services/BookService';
import RequestService from './pages/services/RequestService';
import WaitingProvider from './pages/services/WaitingProvider';
import ActiveService from './pages/services/ActiveService';
import ProviderRegister from './pages/provider/Register';
import ProfessionalAccount from './pages/professional/Account';
import ClientAccount from './pages/client/Account';
import PassengerRequest from './pages/mobility/PassengerRequest';
import WaitingDriver from './pages/mobility/WaitingDriver';
import ActiveRide from './pages/mobility/ActiveRide';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserType } from './types/user';
import { Toaster } from 'react-hot-toast';
import { ViewModeProvider } from './contexts/ViewModeContext';

function App() {
  return (
    <AuthProvider>
      <ViewModeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/provider" element={<ProviderRegister />} />
            <Route path="/services/category/:categoryId" element={<CategoryDetails />} />
            <Route path="/services/book/:categoryId/:providerId" element={<BookService />} />
            <Route path="/services/request/:categoryId" element={<RequestService />} />
            <Route path="/services/waiting" element={<WaitingProvider />} />
            <Route path="/services/active" element={<ActiveService />} />
            
            {/* Mobility Routes */}
            <Route path="/mobility/request" element={<PassengerRequest />} />
            <Route path="/mobility/waiting-driver" element={<WaitingDriver />} />
            <Route path="/mobility/active-ride" element={<ActiveRide />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={[UserType.ADMIN]}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/payments" element={<AdminPayments />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Professional Routes */}
            <Route
              path="/professional/*"
              element={
                <ProtectedRoute allowedRoles={[UserType.PROFESSIONAL]}>
                  <Routes>
                    <Route path="/" element={<ProfessionalAccount />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/client/*"
              element={
                <ProtectedRoute allowedRoles={[UserType.CLIENT]}>
                  <Routes>
                    <Route path="/" element={<ClientAccount />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ViewModeProvider>
    </AuthProvider>
  );
}

export default App;