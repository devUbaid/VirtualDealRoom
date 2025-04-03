import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-600 text-white">
                <i className="fas fa-handshake text-xl"></i>
              </div>
              <div className="ml-3 text-xl font-bold text-gray-900">Virtual Deal Room</div>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Secure platform for business transactions, negotiations, and document sharing.
            </p>
            <div className="mt-6 flex space-x-4">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                  aria-label={social}
                >
                  <i className={`fab fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {[
            {
              title: "Quick Links",
              links: [
                { name: "Home", to: "/" },
                { name: "Marketplace", to: "/listings" },
                { name: "Dashboard", to: "/dashboard" },
                { name: "My Profile", to: "/profile" }
              ]
            },
            {
              title: "Resources",
              links: [
                { name: "Help Center", to: "#" },
                { name: "Documentation", to: "#" },
                { name: "API Reference", to: "#" },
                { name: "Blog", to: "#" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Terms of Service", to: "#" },
                { name: "Privacy Policy", to: "#" },
                { name: "Cookie Policy", to: "#" },
                { name: "Security", to: "#" }
              ]
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.to.startsWith('/') ? (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-start group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 mr-1 text-indigo-600 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                          →
                        </span>
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.to}
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-start group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 mr-1 text-indigo-600 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                          →
                        </span>
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="mt-4 sm:flex">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Virtual Deal Room. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="flex items-center">
              <i className="fas fa-globe text-gray-400 mr-2"></i>
              <select className="bg-transparent text-sm text-gray-500 border-none focus:ring-0 focus:outline-none">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <i className="fas fa-shield-alt text-indigo-500 mr-2"></i>
              <span>Secure Transactions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer