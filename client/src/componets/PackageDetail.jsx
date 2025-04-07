// PackageDetails.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';

// Import slick-carousel CSS files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the current user from Redux state
  const currentUser = useSelector((state) => state.user.currentUser);

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For full image modal view
  const [fullImageModal, setFullImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  // For sign in popup modal
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  // Fetch package details from backend
  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      try {
        const res = await fetch(`/api/listing/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
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
    }
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

  // Handlers to open/close the full image modal
  const openFullImage = (url) => {
    setCurrentImage(url);
    setFullImageModal(true);
  };
  const closeFullImage = () => {
    setFullImageModal(false);
    setCurrentImage('');
  };

  // Handle the Book Now button click.
  // If currentUser exists, navigate to the booking page.
  // Otherwise, display the sign in popup.
  const handleBookNow = () => {
    if (currentUser && currentUser._id) {
      navigate(`/booking/${pkg._id}`);
    } else {
      setShowSignInPopup(true);
    }
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
                  className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openFullImage(url)}
                />
                <button
                  onClick={() => openFullImage(url)}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-75 transition duration-200"
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
                className="max-w-full max-h-screen rounded shadow-lg"
              />
              <button
                onClick={closeFullImage}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition duration-200"
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
              {pkg.discountPrice && Number(pkg.discountPrice) < Number(pkg.regularPrice) ? (
                <p className="font-bold">
                  <span className="text-red-500 line-through mr-2">${pkg.regularPrice}</span>
                  <span className="text-green-600">${pkg.discountPrice}</span>
                </p>
              ) : (
                <p className="text-green-600 font-bold">${pkg.regularPrice}</p>
              )}
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
          
          {/* Book Now Button */}
          <div className="mt-8">
            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Sign In / Sign Up Popup Modal */}
      {showSignInPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Sign In Required</h2>
            <p className="mb-6 text-gray-600">
              Please sign in or sign up to book this package.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setShowSignInPopup(false);
                  navigate('/sign-in');
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 shadow"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowSignInPopup(false);
                  navigate('/sign-up');
                }}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200 shadow"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowSignInPopup(false)}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200 shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
