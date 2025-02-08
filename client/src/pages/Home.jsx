import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/listing', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch packages');
        }
        setPackages(data.listings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Explore Your Dream Destinations</h1>
      <p className="text-lg mb-8">Find the best travel packages for your perfect getaway.</p>

      {loading && <p>Loading packages...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white shadow-md rounded p-4">
            <img
              src={pkg.imageUrls && pkg.imageUrls[0]}
              alt={pkg.title}
              className="w-full h-48 object-cover mb-2"
            />
            <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
            <p className="text-gray-700 mb-2">{pkg.destination}</p>
            <p className="text-green-600 font-bold mb-2">${pkg.regularPrice}</p>
            <Link to={`/package/${pkg._id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
