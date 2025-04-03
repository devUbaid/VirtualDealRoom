import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center py-16">
      <div className="text-8xl font-bold text-primary-color mb-4">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <p className="text-gray mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <i className="fas fa-home mr-2"></i> Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound

