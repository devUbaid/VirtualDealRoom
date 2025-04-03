import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import { NotificationProvider } from "./context/NotificationContext"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminLogin from "./pages/AdminLogin"
import Dashboard from "./pages/Dashboard"
import DealRoom from "./pages/DealRoom"
import CreateDeal from "./pages/CreateDeal"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import Listings from "./pages/Listings"
import ListingDetail from "./pages/ListingDetail"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import SellerProfile from "./pages/SellerProfile"
import UserProfile from "./pages/UserProfile"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import SellerRoute from "./components/SellerRoute"

// Styles
import "./App.css"

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <div className="app">
              <ToastContainer position="top-right" autoClose={3000} />
              <Navbar />
              <main className="main-content">
                <Routes>
                <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-login" element={<AdminLogin />} />

                  {/* Dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Deal Routes */}
                  <Route
                    path="/deals/create"
                    element={
                      <ProtectedRoute>
                        <CreateDeal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/deals/:dealId"
                    element={
                      <ProtectedRoute>
                        <DealRoom />
                      </ProtectedRoute>
                    }
                  />

                  {/* Listing Routes */}
                  <Route path="/listings" element={<Listings />} />
                  <Route path="/listings/:id" element={<ListingDetail />} />
                  <Route
                    path="/listings/create"
                    element={
                      <SellerRoute>
                        <CreateListing />
                      </SellerRoute>
                    }
                  />
                  <Route
                    path="/listings/:id/edit"
                    element={
                      <SellerRoute>
                        <EditListing />
                      </SellerRoute>
                    }
                  />

                  {/* Profile Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/sellers/:id" element={<SellerProfile />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

