import React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"
import ImageGallery from "../components/ImageGallery"

const ListingDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/listings/${id}`)
        setListing(res.data)

        // Set initial offer price to listing price
        setOfferPrice(res.data.price)

        setLoading(false)
      } catch (err) {
        setError("Error fetching listing details")
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleMakeOffer = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/listings/${id}` } })
      return
    }

    if (user.role !== "buyer") {
      setError("Only buyers can make offers")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const res = await axios.post(
        `${API_URL}/api/deals/from-listing`,
        {
          listingId: id,
          price: Number.parseFloat(offerPrice),
          message: offerMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setSubmitting(false)
      setSuccess("Your offer has been sent! Redirecting to deal room...")

      // Redirect to deal room after 2 seconds
      setTimeout(() => {
        navigate(`/deals/${res.data._id}`)
      }, 2000)
    } catch (err) {
      setSubmitting(false)
      setError(err.response?.data?.message || "Error sending offer")
    }
  }

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/listings/${id}` } })
      return
    }

    // Open deal room with default price
    handleMakeOffer({ preventDefault: () => {} })
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
        <button onClick={() => navigate("/listings")} className="btn btn-primary mt-4">
          Back to Listings
        </button>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container">
        <div className="alert alert-danger">Listing not found</div>
        <button onClick={() => navigate("/listings")} className="btn btn-primary mt-4">
          Back to Listings
        </button>
      </div>
    )
  }

  // Check if current user is the seller
  const isOwner = user && listing.seller._id === user._id

  return (
    <div className="container">
      <div className="mb-4">
        <button onClick={() => navigate("/listings")} className="btn btn-outline">
          <i className="fas fa-arrow-left mr-2"></i> Back to Listings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="md:col-span-2">
          <ImageGallery images={listing.images} title={listing.title} />

          <div className="mt-6 bg-bg-primary rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="whitespace-pre-line">{listing.description}</p>

            {listing.features && listing.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-5">
                  {listing.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div>
          <div className="bg-bg-primary rounded-lg shadow-md p-4 sticky top-4">
            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
            <div className="text-3xl font-bold text-primary-color mb-4">${listing.price.toLocaleString()}</div>

            <div className="flex items-center mb-4">
              <div className="badge badge-secondary mr-2">{listing.category}</div>
              <div className="text-sm text-gray">
                <i className="far fa-eye mr-1"></i> {listing.views} views
              </div>
            </div>

            <div className="flex items-center mb-6">
              <img
                src={listing.seller.profileImage || "/placeholder.svg?height=40&width=40"}
                alt={listing.seller.name}
                className="w-10 h-10 rounded-full mr-3"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=40&width=40"
                }}
              />
              <div>
                <div className="font-medium">{listing.seller.name}</div>
                <div className="text-sm text-gray">Seller</div>
              </div>
            </div>

            {isOwner ? (
              <div className="space-y-3">
                <button onClick={() => navigate(`/listings/${listing._id}/edit`)} className="btn btn-primary w-full">
                  <i className="fas fa-edit mr-1"></i> Edit Listing
                </button>
                <button className="btn btn-outline w-full">
                  <i className="fas fa-chart-line mr-1"></i> View Statistics
                </button>
              </div>
            ) : (
              <>
                {success ? (
                  <div className="alert alert-success mb-4">
                    <i className="fas fa-check-circle mr-2"></i> {success}
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-danger mb-4">
                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                      </div>
                    )}

                    <form onSubmit={handleMakeOffer}>
                      <div className="form-group">
                        <label htmlFor="offerPrice" className="form-label">
                          Your Offer
                        </label>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold mr-2">$</span>
                          <input
                            type="number"
                            id="offerPrice"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="form-control"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="offerMessage" className="form-label">
                          Message to Seller (Optional)
                        </label>
                        <textarea
                          id="offerMessage"
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          className="form-control"
                          rows="3"
                          placeholder="Introduce yourself and explain your offer..."
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                        {submitting ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <i className="fas fa-paper-plane mr-1"></i> Send Offer
                          </>
                        )}
                      </button>
                    </form>

                    <div className="text-center mt-3">
                      <button onClick={handleContactSeller} className="btn btn-outline w-full" disabled={submitting}>
                        <i className="fas fa-comments mr-1"></i> Contact Seller
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {listing.location && (
              <div className="mt-6 pt-4 border-t border-border-color">
                <div className="flex items-center text-sm text-gray">
                  <i className="fas fa-map-marker-alt mr-2 text-primary-color"></i>
                  {listing.location}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail

