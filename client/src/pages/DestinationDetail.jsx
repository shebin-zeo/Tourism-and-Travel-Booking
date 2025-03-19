// src/pages/DestinationDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

// A simple ImageSlider component that cycles through images
function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-auto object-cover transition-all duration-500 ease-in-out"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  // State to toggle "Read More"
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetch(`/api/destinations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDestination(data.destination);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center p-8 text-xl">Loading...</p>;
  if (!destination)
    return <p className="text-center p-8 text-xl">Destination not found</p>;

  // Determine how many characters to show initially
  const descriptionLimit = 300;
  const isLongDescription =
    destination.description && destination.description.length > descriptionLimit;
  const displayedDescription = showFullDescription || !isLongDescription
    ? destination.description
    : destination.description.slice(0, descriptionLimit) + "...";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        {destination.name}
      </h1>
      <div className="w-full max-w-3xl mx-auto">
        {destination.videoUrl ? (
          <video controls className="w-full rounded-lg shadow-lg">
            <source src={destination.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          destination.imageUrls &&
          destination.imageUrls.length > 0 &&
          (destination.imageUrls.length > 1 ? (
            <ImageSlider images={destination.imageUrls} />
          ) : (
            <img
              src={destination.imageUrls[0]}
              alt={destination.name}
              className="w-full rounded-lg shadow-lg"
            />
          ))
        )}
      </div>
      <div className="mt-8">
        <p
          className="text-lg leading-relaxed whitespace-pre-line text-gray-700"
          style={{ textAlign: "justify" }}
        >
          {displayedDescription}
        </p>
        {isLongDescription && (
          <button
            onClick={() => setShowFullDescription((prev) => !prev)}
            className="mt-2 text-blue-600 font-semibold hover:underline"
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
