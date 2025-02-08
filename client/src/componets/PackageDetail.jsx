import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listing/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch package details');
        }
        setPkg(data.listing);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) return <p>Loading package details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!pkg) return <p>Package not found.</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{pkg.title}</h1>
      <img
        src={pkg.imageUrls && pkg.imageUrls[0]}
        alt={pkg.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="mb-4">{pkg.description}</p>
      <p className="text-green-600 font-bold mb-4">${pkg.regularPrice}</p>
      <p className="mb-4">{pkg.destination}</p>
    </div>
  );
}
