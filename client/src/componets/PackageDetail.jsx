import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';

// Import slick-carousel CSS files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for full image modal view
  const [fullImageModal, setFullImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

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
        // Expected response: { success: true, listing: { ... } }
        setPkg(data.listing);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // react-slick slider settings
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Open modal with full image view
  const openFullImage = (imgUrl) => {
    setCurrentImage(imgUrl);
    setFullImageModal(true);
  };

  // Close the full image modal
  const closeFullImage = () => {
    setFullImageModal(false);
    setCurrentImage('');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="container mx-auto p-8">
        <p>Package not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Slider */}
        {pkg.imageUrls && pkg.imageUrls.length > 0 && (
          <Slider {...sliderSettings}>
            {pkg.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`${pkg.title} ${index + 1}`}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => openFullImage(url)}
                />
                <button
                  onClick={() => openFullImage(url)}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-75"
                >
                  View Full Image
                </button>
              </div>
            ))}
          </Slider>
        )}

        {/* Full Image Modal */}
        {fullImageModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={closeFullImage}
          >
            <div className="relative">
              <img
                src={currentImage}
                alt="Full View"
                className="max-w-full max-h-screen rounded"
              />
              <button
                onClick={closeFullImage}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Package Information */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{pkg.title}</h1>
          <p className="text-gray-700 mb-4">{pkg.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold">Destination:</p>
              <p className="text-gray-600">{pkg.destination}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Price:</p>
              <p className="text-green-600 font-bold">${pkg.regularPrice}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Duration:</p>
              <p className="text-gray-600">{pkg.duration} days</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Package Type:</p>
              <p className="text-gray-600">{pkg.packageType}</p>
            </div>
          </div>

          {/* Itinerary Section */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-2">Itinerary</h2>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.itinerary.map((item, index) => (
                  <li key={index} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Accommodations:</p>
              <p>{pkg.accommodations ? 'Included' : 'Not Included'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Transport:</p>
              <p>{pkg.transport ? 'Included' : 'Not Included'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Special Offer:</p>
              <p>{pkg.offer ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
