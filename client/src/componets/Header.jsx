import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Define a default avatar URL
  const defaultAvatar = "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Only navigate if the query is not empty
    if (searchQuery.trim()) {
      // Redirect to the search results page with query as URL parameter
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-white font-extrabold text-xl">
              <span className="text-yellow-300">Wander</span>
              <span className="ml-2">Sphere</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-4">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button type="submit" className="absolute left-3 top-2 text-gray-400">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-yellow-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-yellow-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-white hover:text-yellow-300">
                  Blogs
                </Link>
              </li>
              {/* Destinations link */}
              <li>
                <Link to="/destinations" className="text-white hover:text-yellow-300">
                  Editors Choice
                </Link>
              </li>
              {/* Show "Mark Journey" only if logged in */}
              {currentUser && (
                <li>
                  <Link to="/blog/submit" className="text-white hover:text-yellow-300">
                    Mark Journey
                  </Link>
                </li>
              )}
              {/* Profile / Sign In */}
              <li>
                <Link to="/profile" className="flex items-center">
                  {currentUser ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-yellow-300"
                      src={currentUser.avatar || defaultAvatar}
                      alt="Profile"
                    />
                  ) : (
                    <span className="text-white hover:text-yellow-300">
                      Sign In
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
