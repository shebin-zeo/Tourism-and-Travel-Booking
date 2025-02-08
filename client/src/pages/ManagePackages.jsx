import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/listing', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch listings');
        }
        setListings(data.listings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Admin Dashboard - Listings</h1>

      {loading && <p>Loading packages...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p>No packages found. Please create a new package.</p>
      )}

      {/* Display listings in a table */}
      {!loading && listings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Destination</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Duration</th>
                <th className="py-2 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td className="py-2 px-4 border-b">{listing.title}</td>
                  <td className="py-2 px-4 border-b">{listing.destination}</td>
                  <td className="py-2 px-4 border-b">{listing.packageType}</td>
                  <td className="py-2 px-4 border-b">${listing.regularPrice}</td>
                  <td className="py-2 px-4 border-b">{listing.duration} days</td>
                  <td className="py-2 px-4 border-b">{new Date(listing.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
