import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OnlinePooja from './pages/OnlinePooja';
import LiveDarshan from './pages/LiveDarshan';
import BhaktiStore from './pages/BhaktiStore';
import BhaktiYoga from './pages/BhaktiYoga';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TestIntegration from './pages/TestIntegration';
import Footer from './components/Footer';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import MyBookings from './pages/Dashboard/MyBookings';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import ManageBookings from './pages/Admin/ManageBookings';
import ManageProducts from './pages/Admin/ManageProducts';
import { CartProvider } from './contexts/CartContext';
import CheckoutPage from './pages/CheckoutPage';
import ShoppingCart from './components/ShoppingCart';
import MyOrders from './pages/Dashboard/MyOrders';
import ManageOrders from './pages/Admin/ManageOrders';
import { Toaster } from 'react-hot-toast';
import ManageCourses from './pages/Admin/ManageCourses';
import CourseEditor from './pages/Admin/CourseEditor';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import MyCourses from './pages/Dashboard/MyCourses';
import SubscriptionPage from './pages/SubscriptionPage';
import ManageCatalogues from './pages/Admin/ManageCatalogues';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 5000, // Toasts for 5 seconds
                style: {
                  background: '#333',
                  color: '#fff',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  fontFamily: 'var(--body-font)',
                },
              }}
            />
            <Navbar />
            <ShoppingCart />
            <Routes>
              {/* Public Routes  */}
              <Route path="/" element={<Home />} />
              {/* <Route path="/online-pooja" element={<OnlinePooja />} /> */}
              <Route path="/live-darshan" element={<LiveDarshan />} />
              <Route path="/bhakti-store" element={<BhaktiStore />} />
              {/* <Route path="/bhakti-yoga" element={<BhaktiYoga />} /> */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/test-integration" element={<TestIntegration />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    {/* // Profile comp  */}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    {/* My bookings component  */}
                  </ProtectedRoute>
                }
              />

              <Route
                path='/bhakti-yoga'
                element={
                  <ProtectedRoute>
                    <BhaktiYoga />
                  </ProtectedRoute>
                }
              >
              </Route>

              <Route
                path="/bhakti-yoga/courses/:id"
                element={
                  <ProtectedRoute>
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/courses/player/:id"
                element={
                  <ProtectedRoute>
                    <CoursePlayerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/online-pooja'
                element={
                  <ProtectedRoute>
                    <OnlinePooja />
                  </ProtectedRoute>
                }
              >
              </Route>
              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }>
                <Route path="bookings" element={<MyBookings />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="courses" element={<MyCourses />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              <Route
                path='/checkout'
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subscribe"
                element={
                  <ProtectedRoute>
                    <SubscriptionPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }>
                {/* placeholder for the main admin dashboard */}
                <Route path="dashboard" element={<div>Admin Overview</div>} />
                <Route path="bookings" element={<ManageBookings />} />
                <Route path='products' element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="catalogues" element={<ManageCatalogues />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/:courseId/edit" element={<CourseEditor />} />
              </Route>
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
