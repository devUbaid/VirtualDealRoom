"use client"

import { useState, useEffect } from "react"

const ListingFilter = ({ filters, onFilterChange, categories }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilterChange(localFilters)
  }

  const handleClear = () => {
    const clearedFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sort: "newest",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-bg-primary rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="form-group mb-0">
            <label htmlFor="search" className="form-label text-sm">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                value={localFilters.search}
                onChange={handleInputChange}
                className="form-control pl-10"
                placeholder="Search listings..."
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray"></i>
            </div>
          </div>

          <div className="form-group mb-0">
            <label htmlFor="category" className="form-label text-sm">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={localFilters.category}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label htmlFor="minPrice" className="form-label text-sm">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Min"
              min="0"
            />
          </div>

          <div className="form-group mb-0">
            <label htmlFor="maxPrice" className="form-label text-sm">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Max"
              min="0"
            />
          </div>

          <div className="form-group mb-0">
            <label htmlFor="sort" className="form-label text-sm">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              value={localFilters.sort}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button type="button" onClick={handleClear} className="btn btn-outline">
            <i className="fas fa-times mr-1"></i> Clear
          </button>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-filter mr-1"></i> Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}

export default ListingFilter

