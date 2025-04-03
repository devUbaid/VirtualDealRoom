
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import Spinner from "../components/Spinner"
import ListingCard from "../components/ListingCard"
import ListingFilter from "../components/ListingFilter"

const Listings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  })

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",
  })

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)

        // Build query string from filters
        const queryParams = new URLSearchParams()
        if (filters.category) queryParams.append("category", filters.category)
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice)
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice)
        if (filters.search) queryParams.append("search", filters.search)

        // Map sort values to API expected values
        const sortMap = {
          newest: "",
          "price-asc": "price-asc",
          "price-desc": "price-desc",
          popular: "popular",
        }
        if (sortMap[filters.sort]) queryParams.append("sort", sortMap[filters.sort])

        queryParams.append("page", pagination.page)
        queryParams.append("limit", 12)

        const res = await axios.get(`${API_URL}/api/listings?${queryParams.toString()}`)

        setListings(res.data.listings)
        setPagination(res.data.pagination)
        setLoading(false)
      } catch (err) {
        setError("Error fetching listings")
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/categories/all`)
        setCategories(res.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchListings()
    fetchCategories()
  }, [filters, pagination.page])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <i className="fas fa-store text-primary-color mr-2"></i>
          Marketplace
        </h1>
        <Link to="/listings/create" className="btn btn-primary">
          <i className="fas fa-plus mr-1"></i> Post New Listing
        </Link>
      </div>

      <ListingFilter filters={filters} onFilterChange={handleFilterChange} categories={categories} />

      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : listings.length === 0 ? (
        <div className="text-center my-12 py-8 bg-bg-secondary rounded-lg border border-border-color">
          <i className="fas fa-store-slash text-5xl text-text-light mb-4"></i>
          <p className="text-lg mb-4">No listings found matching your criteria</p>
          <button
            onClick={() =>
              handleFilterChange({
                category: "",
                minPrice: "",
                maxPrice: "",
                search: "",
                sort: "newest",
              })
            }
            className="btn btn-primary"
          >
            <i className="fas fa-sync-alt mr-1"></i> Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
                  disabled={pagination.page === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  // Show pages around current page
                  let pageNum
                  if (pagination.pages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${pagination.page === pageNum ? "btn-primary" : "btn-outline"}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(Math.min(pagination.page + 1, pagination.pages))}
                  disabled={pagination.page === pagination.pages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Listings

