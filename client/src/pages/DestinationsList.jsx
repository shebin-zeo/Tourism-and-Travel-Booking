// src/pages/DestinationsList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DestinationsList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/destinations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch destinations");
        }
        setDestinations(data.destinations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter destinations based on selected type.
  const filteredDestinations = destinations.filter((dest) => {
    if (filter === "All") return true;
    // Assumes each destination document has a 'type' field.
    return dest.type === filter;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading Destinations...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (destinations.length === 0) {
    return <div className="p-8 text-center">No destinations found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 text-center">All Destinations</h1>

      {/* Filtering Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All</option>
          <option value="Adventure">Adventure</option>
          <option value="Cultural">Cultural</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Luxury">Luxury</option>
          <option value="Island">Island</option>
          <option value="Historical">Historical</option>
        </select>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest._id}
            className="bg-white shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300"
          >
            {dest.imageUrls && dest.imageUrls.length > 0 && (
              <img
                src={dest.imageUrls[0]}
                alt={dest.name}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-xl font-bold mt-4">{dest.name}</h2>
            <p className="text-gray-700 mt-2">
              {dest.description.length > 80
                ? dest.description.slice(0, 80) + "..."
                : dest.description}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/destination/${dest._id}`}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                View Details
              </Link>
              {dest.type && (
                <span className="text-sm text-gray-500 italic">
                  {dest.type}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
