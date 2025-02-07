import { useState } from 'react';
import { FaImage, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';

export default function CreatePackage() {
  // States for checkboxes
  const [offer, setOffer] = useState(false);
  const [accommodations, setAccommodations] = useState(false);
  const [transport, setTransport] = useState(false);

  // State for form data (including Cloudinary image URLs)
  const [formData, setFormData] = useState({
    imageUrls: [],
    package_title: '',
    description: '',
    destination: '',
    package_type: '',
    regular_price: 0,
    discount: 0,
    duration: 0,
    itinerary: '',
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Cloudinary image upload function
  const handleImageSubmit = () => {
    if (formData.imageUrls.length >= 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }
    setUploading(true);
    setImageUploadError('');

    window.cloudinary.openUploadWidget(
      {
        cloud_name: 'drqoa7h5u',
        upload_preset: 'Package_tours',
        sources: ['local', 'url', 'camera'],
        folder: 'Packages_tours',
        multiple: true,
        max_files: 6 - formData.imageUrls.length,
      },
      (error, result) => {
        if (error) {
          setImageUploadError('Image upload failed');
          setUploading(false);
          return;
        }
        if (result.event === 'success') {
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, result.info.secure_url],
          }));
        }
        if (result.event === 'close') {
          setUploading(false);
        }
      }
    );
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Handle text and select changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle checkbox changes (if you prefer to keep separate state, merge it on submit)
  const handleCheckboxChange = (e, setter) => {
    setter(e.target.checked);
  };

  // Handle form submission to send data to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the full data object by merging checkbox states
    const dataToSend = {
      title: formData.package_title,  // 'package_title' to 'title'
      description: formData.description,
      destination: formData.destination,
      packageType: formData.package_type,  // 'package_type' to 'packageType'
      duration: formData.duration,
      regularPrice: formData.regular_price,  // 'regular_price' to 'regularPrice'
      discountPrice: formData.discount,  // 'discount' to 'discountPrice'
      offer,
      accommodations,
      transport,
      itinerary: formData.itinerary.split("\n"),  // Assuming itinerary is entered with line breaks
      imageUrls: formData.imageUrls,
      adminRef: '65f3a1234567890abcdef',  // admin reference (you'll replace with actual value)
      guideRef: '65f3b9876543210fedcba',  // guide reference (you'll replace with actual value)
    };

    // Check for missing required fields before submitting
    if (
      !dataToSend.title ||
      !dataToSend.description ||
      !dataToSend.destination ||
      !dataToSend.packageType ||
      !dataToSend.regularPrice ||
      !dataToSend.discountPrice ||
      !dataToSend.duration ||
      !dataToSend.itinerary
    ) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error('Error:', result.message);
        return;
      }
      console.log('Package created successfully:', result.package);
      // Optionally, redirect or reset the form here
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  return (
    <main className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Create a New Tour Package
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Title */}
        <div className="flex flex-col">
          <label htmlFor="package_title" className="text-lg font-medium text-gray-700">
            Package Title
          </label>
          <input
            type="text"
            id="package_title"
            placeholder="Bali Adventure Package"
            value={formData.package_title}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            placeholder="A 7-day adventure exploring Bali's beautiful beaches and temples."
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Destination */}
        <div className="flex flex-col">
          <label htmlFor="destination" className="text-lg font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            placeholder="Bali, Indonesia"
            value={formData.destination}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Package Type */}
        <div className="flex flex-col">
          <label htmlFor="package_type" className="text-lg font-medium text-gray-700">
            Package Type
          </label>
          <select
            id="package_type"
            value={formData.package_type}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Type</option>
            <option value="Adventure">Adventure</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>

        {/* Regular Price */}
        <div className="flex flex-col">
          <label htmlFor="regular_price" className="text-lg font-medium text-gray-700">
            Regular Price
          </label>
          <input
            type="number"
            id="regular_price"
            placeholder="$1200"
            value={formData.regular_price}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Discount Price */}
        <div className="flex flex-col">
          <label htmlFor="discount" className="text-lg font-medium text-gray-700">
            Discount Price
          </label>
          <input
            type="number"
            id="discount"
            placeholder="$999"
            value={formData.discount}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col">
          <label htmlFor="duration" className="text-lg font-medium text-gray-700">
            Duration (Days)
          </label>
          <input
            type="number"
            id="duration"
            placeholder="7"
            value={formData.duration}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Itinerary */}
        <div className="flex flex-col">
          <label htmlFor="itinerary" className="text-lg font-medium text-gray-700">
            Itinerary
          </label>
          <textarea
            id="itinerary"
            rows="4"
            placeholder="Day 1: Arrival in Bali, Day 2: Ubud Tour, Day 3: Beach Activities"
            value={formData.itinerary}
            onChange={handleInputChange}
            className="mt-2 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Cloudinary Image Upload */}
        <div className="flex flex-col">
          <label htmlFor="images" className="text-lg font-medium text-gray-700 flex items-center">
            <FaImage className="mr-2 text-gray-500" />
            Images
          </label>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            The first image will be the cover (max 6 images allowed).
          </p>
          {imageUploadError && <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>}
          {formData.imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package Offer Options */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Offer Options</label>
          <div className="flex items-center mt-2">
            <span className="mr-2">
              {offer ? <FaCheckCircle /> : <FaRegCheckCircle />}
            </span>
            <input
              type="checkbox"
              checked={offer}
              onChange={(e) => handleCheckboxChange(e, setOffer)}
              className="mr-2"
            />
            <span>Special Offer</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="mr-2">
              {accommodations ? <FaCheckCircle /> : <FaRegCheckCircle />}
            </span>
            <input
              type="checkbox"
              checked={accommodations}
              onChange={(e) => handleCheckboxChange(e, setAccommodations)}
              className="mr-2"
            />
            <span>Accommodation Included</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="mr-2">
              {transport ? <FaCheckCircle /> : <FaRegCheckCircle />}
            </span>
            <input
              type="checkbox"
              checked={transport}
              onChange={(e) => handleCheckboxChange(e, setTransport)}
              className="mr-2"
            />
            <span>Transport Included</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700"
          >
            Submit Package
          </button>
        </div>
      </form>
    </main>
  );
}
