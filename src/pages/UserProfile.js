"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const UserProfile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    contactPhone: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Profile image state
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        contactPhone: user.contactPhone || "",
      })

      if (user.profileImage) {
        setImagePreview(`${API_URL}${user.profileImage}`)
      }
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({ ...passwordData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, WebP)")
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should not exceed 2MB")
      return
    }

    setProfileImage(file)
    setImagePreview(URL.createObjectURL(file))
    setError("")
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      const formData = new FormData()
      formData.append("name", profileData.name)
      formData.append("email", profileData.email)
      formData.append("bio", profileData.bio)
      formData.append("location", profileData.location)
      formData.append("contactPhone", profileData.contactPhone)

      if (profileImage) {
        formData.append("profileImage", profileImage)
      }

      const token = localStorage.getItem("token")
      const res = await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      updateProfile(res.data)
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")
      await axios.put(
        `${API_URL}/api/users/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSuccess("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Error updating password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
            <i className="fas fa-user-circle text-xl"></i>
          </div>
          My Profile
        </h1>
        {user?.role === "seller" && (
          <button
            onClick={() => navigate("/listings/my-listings")}
            className="hidden md:flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <i className="fas fa-store mr-2"></i>
            My Listings
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === "profile"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === "password"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-lock mr-2"></i>
              Password
            </button>
            {user?.role === "seller" && (
              <button
                onClick={() => navigate("/listings/my-listings")}
                className="md:hidden py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <i className="fas fa-store mr-2"></i>
                Listings
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Status Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={imagePreview || "/default-avatar.png"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/default-avatar.png"
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-colors"
                    >
                      <i className="fas fa-camera text-sm"></i>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                    />
                  </div>
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    JPG, PNG or WebP. Max 2MB.
                  </p>
                </div>

                {/* Profile Form */}
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows="3"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={profileData.contactPhone}
                        onChange={handleProfileChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key mr-2"></i>
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile