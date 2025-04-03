"use client"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import Spinner from "../components/Spinner"
import ListingCard from "../components/ListingCard"

const SellerProfile = () => {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalListings: 0,
    completedDeals: 0,
    activeDeals: 0,
    averageRating: 0,
  })

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true)
        const [sellerRes, listingsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/${id}`),
          axios.get(`${API_URL}/api/listings/seller/${id}`)
        ])

        setSeller(sellerRes.data)
        setListings(listingsRes.data)
        setStats({
          totalListings: listingsRes.data.length,
          completedDeals: sellerRes.data.completedDeals || 0,
          activeDeals: sellerRes.data.activeDeals || 0,
          averageRating: sellerRes.data.averageRating || 0,
        })
      } catch (err) {
        setError("Error loading seller profile")
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner size="xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
            <div>
              <p className="font-medium text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
            <div>
              <p className="font-medium text-yellow-700">Seller not found</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Seller Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
            <img
              src={seller.profileImage || "/default-avatar.png"}
              alt={seller.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/default-avatar.png"
              }}
            />
          </div>

          <div className="ml-40 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>{seller.location || "Location not specified"}</span>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0 flex items-center">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-blue-800 font-medium mr-1">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <i className="fas fa-star text-yellow-400"></i>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalListings}</div>
                <div className="text-sm text-gray-600">Listings</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.completedDeals}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.activeDeals}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.averageRating.toFixed(1)}/5
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">
                {seller.bio || "This seller hasn't provided a bio yet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-store text-indigo-600 mr-3"></i>
            Active Listings
          </h2>
          <span className="text-sm text-gray-500">
            Showing {listings.length} {listings.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <i className="fas fa-store-slash text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active listings
            </h3>
            <p className="text-gray-500">
              This seller hasn't posted any listings yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link 
          to="/listings" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Listings
        </Link>
      </div>
    </div>
  )
}

export default SellerProfile