// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all listings from the backend.
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const res = await fetch("/api/listing", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch listings");
        }
        setListings(data.listings);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Filter listings based on query (searching in title and destination)
  const filteredListings = listings.filter((listing) => {
    const lowerQuery = query.toLowerCase();
    return (
      listing.title.toLowerCase().includes(lowerQuery) ||
      listing.destination.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {loading && (
        <p className="text-center text-gray-600">Loading search results...</p>
      )}
      {error && (
        <p className="text-center text-red-600">Error: {error}</p>
      )}
      {!loading && filteredListings.length === 0 && (
        <p className="text-center">No packages found matching your search.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredListings.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105"
          >
            {pkg.imageUrls && pkg.imageUrls.length > 0 && (
              <img
                src={pkg.imageUrls[0]}
                alt={pkg.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-xl font-bold mt-4">{pkg.title}</h2>
            <p className="text-gray-700 mt-2">{pkg.destination}</p>
            <p className="text-green-600 font-bold mt-2">${pkg.regularPrice}</p>
            <Link
              to={`/package/${pkg._id}`}
              className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
