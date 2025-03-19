// src/pages/EditorsChoice.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function EditorsChoice() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEditorsChoice() {
      try {
        const res = await fetch("/api/destinations/editor-choice", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch editor's choice destinations");
        }
        setDestinations(data.destinations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEditorsChoice();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading Editors Choice...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (destinations.length === 0) {
    return <div className="p-8 text-center">No hidden spots found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
      Explore Kerala Tourism 
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <Link key={dest._id} to={`/destination/${dest._id}`} className="block">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
              {dest.videoUrl ? (
                <video controls className="w-full h-64 object-cover">
                  <source src={dest.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                dest.imageUrls && dest.imageUrls.length > 0 && (
                  <img
                    src={dest.imageUrls[0]}
                    alt={dest.name}
                    className="w-full h-64 object-cover"
                  />
                )
              )}
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {dest.name}
                </h2>
                <p className="text-gray-600">
                  {dest.description.length > 100
                    ? dest.description.slice(0, 100) + "..."
                    : dest.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
