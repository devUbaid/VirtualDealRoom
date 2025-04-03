import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"

const ListingCard = ({ listing }) => {
  // Get the first image or use a placeholder
  const imageUrl =
    listing.images && listing.images.length > 0
      ? `${process.env.REACT_APP_API_URL}${listing.images[0].url}`
      : "/placeholder.svg?height=200&width=300"

  return (
    <div className="listing-card">
      <div className="listing-image-container">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={listing.title}
          className="listing-image"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg?height=200&width=300"
          }}
        />
        <div className="listing-category">
          <span>{listing.category}</span>
        </div>
      </div>

      <div className="listing-content">
        <h3 className="listing-title">{listing.title}</h3>
        <div className="listing-price">${listing.price.toLocaleString()}</div>
        <p className="listing-description">{listing.description.substring(0, 80)}...</p>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <img
              src={listing.seller.profileImage || "/placeholder.svg?height=30&width=30"}
              alt={listing.seller.name}
              className="w-6 h-6 rounded-full mr-2"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=30&width=30"
              }}
            />
            <span className="text-sm text-gray">{listing.seller.name}</span>
          </div>
          <span className="text-xs text-gray">
            {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-4">
          <Link to={`/listings/${listing._id}`} className="btn btn-primary w-full">
            <i className="fas fa-eye mr-1"></i> View Listing
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ListingCard

