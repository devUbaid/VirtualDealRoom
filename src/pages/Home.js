"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-white after:rounded">
              Virtual Deal Room
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              A secure platform for buyers and sellers to negotiate deals, share documents, and finalize transactions in
              real-time.
            </p>

            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                  <i className="fas fa-th-large mr-2"></i> Go to Dashboard
                </Link>
                {user?.role === "seller" && (
                  <Link to="/listings/create" className="btn btn-lg border-2 border-white text-white hover:bg-white/10">
                    <i className="fas fa-plus mr-2"></i> Create Listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                  <i className="fas fa-user-plus mr-2"></i> Sign Up Now
                </Link>
                <Link to="/login" className="btn btn-lg border-2 border-white text-white hover:bg-white/10">
                  <i className="fas fa-sign-in-alt mr-2"></i> Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to securely negotiate and close business deals online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-md">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Deal Creation</h3>
              <p className="text-gray-600">
                Create and negotiate deals with confidence. Our platform ensures all transactions are secure and
                transparent.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-md">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Chat</h3>
              <p className="text-gray-600">
                Communicate instantly with buyers or sellers. Features include typing indicators and read receipts.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-md">
                <i className="fas fa-file-contract"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Document Sharing</h3>
              <p className="text-gray-600">
                Securely upload and share important documents with granular access control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers & Sellers Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">For Buyers & Sellers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're buying or selling, our platform has features designed specifically for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row">
              <div className="md:w-3/5 p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">For Buyers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Browse listings from verified sellers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Make offers and negotiate prices
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Secure document exchange
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Real-time chat with sellers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Track deal progress
                  </li>
                </ul>
                {!isAuthenticated && (
                  <Link to="/register?role=buyer" className="btn btn-primary mt-6 inline-block">
                    <i className="fas fa-user-plus mr-2"></i> Register as Buyer
                  </Link>
                )}
              </div>
              <div className="md:w-2/5 bg-gray-100 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Buyer Features"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row">
              <div className="md:w-3/5 p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">For Sellers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Create and manage listings
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Receive and respond to offers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Secure payment processing
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Document management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-success-500 mr-3"></i> Analytics and reporting
                  </li>
                </ul>
                {!isAuthenticated && (
                  <Link to="/register?role=seller" className="btn btn-secondary mt-6 inline-block">
                    <i className="fas fa-store mr-2"></i> Register as Seller
                  </Link>
                )}
              </div>
              <div className="md:w-2/5 bg-gray-100 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Seller Features"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes business transactions simple, secure, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-[60px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-0.5 bg-gray-200 z-0"></div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create Account</h3>
              <p className="text-gray-600">Sign up as a buyer or seller to access the platform.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create or Browse Listings</h3>
              <p className="text-gray-600">Post your products/services or browse available listings.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Negotiate Deals</h3>
              <p className="text-gray-600">Communicate and negotiate terms in real-time.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-md">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Complete Transaction</h3>
              <p className="text-gray-600">Finalize the deal securely on our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Choose the right option for you and start using our platform.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full transition-all duration-300 hover:-translate-y-2">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">User Access</h3>
              <p className="mb-6 text-gray-600">
                For buyers and sellers to access the deal room, manage listings, and complete transactions.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="btn btn-primary w-full">
                  <i className="fas fa-sign-in-alt mr-2"></i> User Login
                </Link>
                <Link to="/register" className="btn btn-outline w-full">
                  <i className="fas fa-user-plus mr-2"></i> Create Account
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full transition-all duration-300 hover:-translate-y-2">
              <div className="w-24 h-24 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Admin Access</h3>
              <p className="mb-6 text-gray-600">
                For administrators to manage users, monitor transactions, and access analytics.
              </p>
              <Link to="/admin/login" className="btn btn-secondary w-full">
                <i className="fas fa-lock mr-2"></i> Admin Login
              </Link>
              <p className="mt-4 text-sm text-gray-500">Admin accounts are created by system administrators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

