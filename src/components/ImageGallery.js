"use client"

import { useState } from "react"

const ImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // If no images, use placeholder
  const processedImages =
    images && images.length > 0
      ? images.map((img) => ({
          url: `${process.env.REACT_APP_API_URL}${img.url}`,
          filename: img.filename,
        }))
      : [{ url: "/placeholder.svg?height=400&width=600", filename: "placeholder" }]

  const handleThumbnailClick = (index) => {
    setActiveIndex(index)
  }

  const handleMainImageClick = () => {
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? processedImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === processedImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div
        className="main-image-container bg-bg-secondary rounded-lg overflow-hidden cursor-pointer"
        onClick={handleMainImageClick}
      >
        <img
          src={processedImages[activeIndex].url || "/placeholder.svg"}
          alt={title}
          className="main-image"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg?height=400&width=600"
          }}
        />
      </div>

      {/* Thumbnails */}
      {processedImages.length > 1 && (
        <div className="thumbnails-container mt-4 flex gap-2 overflow-x-auto">
          {processedImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={`${title} - ${index + 1}`}
                className="thumbnail-image"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=100&width=100"
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={handleLightboxClose}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={handleLightboxClose}>
              <i className="fas fa-times"></i>
            </button>

            <div className="lightbox-content">
              <img
                src={processedImages[activeIndex].url || "/placeholder.svg"}
                alt={title}
                className="lightbox-image"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=600&width=800"
                }}
              />
            </div>

            {processedImages.length > 1 && (
              <>
                <button className="lightbox-prev" onClick={handlePrevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="lightbox-next" onClick={handleNextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            <div className="lightbox-counter">
              {activeIndex + 1} / {processedImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery

