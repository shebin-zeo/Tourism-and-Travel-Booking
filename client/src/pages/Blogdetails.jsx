// BlogDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

// Import slick-carousel CSS files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function BlogDetail() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // State for full-screen modal view of an image.
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blog post");
        }
        setBlogPost(data.blogPost);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading blog post...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!blogPost) return <p className="text-center mt-8">Blog post not found.</p>;

  // react-slick slider settings.
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>

      {/* Slider for blog images */}
      {blogPost.images && blogPost.images.length > 0 && (
        <>
          <Slider {...sliderSettings} className="mb-4">
            {blogPost.images.map((img, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => setModalImage(img)}
              >
                <img
                  src={img}
                  alt={`${blogPost.title} ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          {/* Fullscreen modal view for selected image */}
          {modalImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
              onClick={() => setModalImage(null)}
            >
              <img
                src={modalImage}
                alt="Full View"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </>
      )}

      <p className="text-gray-700 mb-4">{blogPost.content}</p>
      
      {blogPost.review && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Review</h2>
          <p className="text-gray-700">{blogPost.review}</p>
        </div>
      )}

      {blogPost.itinerary && blogPost.itinerary.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Itinerary</h2>
          <ul className="list-disc list-inside">
            {blogPost.itinerary.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
