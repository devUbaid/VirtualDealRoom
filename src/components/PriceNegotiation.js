"use client"

import { useState, useEffect } from "react"
import { useSocket } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import { formatDistanceToNow } from "date-fns"

const PriceNegotiation = ({ deal, priceHistory, onPriceUpdate }) => {
  const [price, setPrice] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPriceHistory, setShowPriceHistory] = useState(false)
  const { updatePrice } = useSocket()
  const { user } = useAuth()

  useEffect(() => {
    setPrice(deal.price.toString())
  }, [deal.price])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const newPrice = Number.parseFloat(price)

    if (isNaN(newPrice) || newPrice <= 0) {
      setError("Please enter a valid price")
      return
    }

    // For buyer, new price should be lower than current price
    if (user.role === "buyer" && newPrice >= deal.price) {
      setError("As a buyer, you should offer a lower price")
      return
    }

    // For seller, new price should be higher than current price
    if (user.role === "seller" && newPrice <= deal.price) {
      setError("As a seller, you should offer a higher price")
      return
    }

    updatePrice(deal._id, newPrice)
    onPriceUpdate(newPrice)
    setSuccess(
      `Your ${user.role === "buyer" ? "offer" : "asking price"} of $${newPrice.toLocaleString()} has been sent!`,
    )

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Calculate price difference percentage
  const calculatePriceDifference = () => {
    if (priceHistory.length < 2) return null

    const currentPrice = deal.price
    const initialPrice = priceHistory[priceHistory.length - 1].price
    const difference = ((currentPrice - initialPrice) / initialPrice) * 100

    return {
      value: difference.toFixed(2),
      isIncrease: difference > 0,
    }
  }

  const priceDifference = calculatePriceDifference()

  return (
    <div className="price-negotiation">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-tag mr-2 text-primary-color"></i>
          Price Negotiation
        </h3>
        {priceHistory.length > 0 && (
          <button
            onClick={() => setShowPriceHistory(!showPriceHistory)}
            className="text-sm flex items-center text-primary-color hover:underline"
          >
            <i className={`fas fa-chevron-${showPriceHistory ? "up" : "down"} mr-1`}></i>
            {showPriceHistory ? "Hide" : "Show"} History
          </button>
        )}
      </div>

      <div className="current-price mb-4 bg-bg-primary rounded-lg border border-border-color p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray text-sm">Current Price:</span>
            <div className="text-2xl font-bold text-primary-color">${deal.price.toLocaleString()}</div>
          </div>

          {priceDifference && (
            <div
              className={`text-sm ${priceDifference.isIncrease ? "text-danger-color" : "text-success-color"} flex items-center`}
            >
              <i className={`fas fa-arrow-${priceDifference.isIncrease ? "up" : "down"} mr-1`}></i>
              {priceDifference.value}% {priceDifference.isIncrease ? "increase" : "decrease"}
            </div>
          )}
        </div>
      </div>

      {showPriceHistory && priceHistory.length > 0 && (
        <div className="price-history mb-4 bg-bg-secondary rounded-lg border border-border-color p-3">
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <i className="fas fa-history mr-2 text-primary-color"></i>
            Price History
          </h4>
          {priceHistory.map((item, index) => (
            <div key={index} className="price-item">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${item.user.role === "buyer" ? "bg-secondary-color" : "bg-primary-color"}`}
                ></div>
                <span className="font-medium">{item.user.name}</span>
                <span className="text-gray ml-2">{item.user.role === "buyer" ? "offered" : "asked for"}</span>
                <span className="font-medium ml-2">${item.price.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}

      {deal.status !== "completed" && deal.status !== "cancelled" && (
        <form onSubmit={handleSubmit} className="price-form">
          {error && (
            <div className="alert alert-danger mb-3 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-3 flex items-center">
              <i className="fas fa-check-circle mr-2"></i> {success}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex items-center bg-bg-primary rounded-lg border border-border-color px-3 py-2 flex-1">
              <span className="mr-2 text-lg font-semibold">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control price-input border-0 focus:ring-0 p-0 w-full"
                placeholder="Enter your price"
                step="0.01"
                min="0"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane mr-1"></i>
              Submit {user.role === "buyer" ? "Offer" : "Ask"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray text-center">
            {user.role === "buyer" ? (
              <span>As a buyer, you should offer a price lower than the current price.</span>
            ) : (
              <span>As a seller, you should ask for a price higher than the current price.</span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default PriceNegotiation

