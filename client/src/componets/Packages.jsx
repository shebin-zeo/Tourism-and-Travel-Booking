import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Packages() {
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

  if (loading) return <p className="text-center mt-8">Loading packages...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (packages.length === 0) return <p className="text-center mt-8">No packages available.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Travel Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
            <img
              src={pkg.imageUrls[0]}
              alt={pkg.title}
              className="w-full h-48 object-cover"
            />
            {!pkg.enabled && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center">
                <p className="text-white text-xl font-semibold mb-2">Unavailable</p>
                <p className="text-gray-300 text-sm">This package is currently not available.</p>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{pkg.title}</h2>
              <p className="text-gray-600 mt-2">{pkg.destination}</p>
              <p className="mt-2 font-bold">${pkg.regularPrice}</p>
              <Link
                to={`/package/${pkg._id}`}
                className="mt-4 inline-block text-yellow-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
