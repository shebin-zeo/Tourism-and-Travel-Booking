import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ChatBot from "../componets/ChatBot"; // Import the ChatBot component

export default function Home() {
  // Fetch packages from API
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Subscription states
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  // Popup state: { message: string, type: "success" | "error" }
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    // Remove any query parameters from URL on mount.
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/listing", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch packages");
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

  // Create a ref for the hero section
  const heroRef = useRef(null);
  // useScroll hook to track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to opacity and vertical motion for the headline
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.3], [20, 0]);

  // Map scroll progress to opacity and vertical motion for the subheadline and button
  const subOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.3, 0.6], [20, 0]);

  // Newsletter subscription handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Subscription failed");
      }
      // Show success popup and clear email input
      setPopup({ message: "Thank you for subscribing!", type: "success" });
      setSubscribeEmail("");
    } catch (err) {
      setPopup({ message: err.message, type: "error" });
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setPopup(null);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with scroll-based animations */}
      <section
        ref={heroRef}
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3')",
          height: "200vh", // Increase height to allow scrolling and reveal animations
        }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-white px-4">
          <motion.h1
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-5xl md:text-6xl font-bold"
          >
            Explore Your Dream Destinations
          </motion.h1>
          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mt-4 text-xl md:text-2xl max-w-2xl"
          >
            Find the best travel packages and experience unforgettable adventures
            with us.
          </motion.p>
          <motion.div style={{ opacity: subOpacity, y: subY }}>
            <Link
              to="/packages"
              className="mt-8 inline-block bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-400 transition duration-300"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Packages
          </h2>
          {loading && (
            <div className="text-center">
              <p className="text-gray-600">Loading packages...</p>
            </div>
          )}
          {error && (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              // Determine if this package has an offer (discount)
              const hasOffer =
                pkg.discountPrice &&
                Number(pkg.discountPrice) < Number(pkg.regularPrice);
              return (
                <div
                  key={pkg._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative"
                >
                  {/* OFFER Badge (displayed if a discount exists) */}
                  {hasOffer && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded z-10">
                      OFFER
                    </span>
                  )}
                  {/* Package Image with Overlays */}
                  <div className="relative">
                    <img
                      src={
                        pkg.imageUrls?.[0] ||
                        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                      }
                      alt={pkg.title}
                      className="w-full h-64 object-cover"
                    />
                    {/* Unavailable Overlay */}
                    {!pkg.enabled && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center">
                        <p className="text-white text-xl font-semibold mb-2">
                          Unavailable
                        </p>
                        <p className="text-gray-300 text-sm text-center px-2">
                          This package is currently not available.
                        </p>
                      </div>
                    )}
                    {/* "View Details" button rendered only if package is enabled */}
                    {pkg.enabled && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Link
                          to={`/package/${pkg._id}`}
                          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded"
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* Package Information */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{pkg.destination}</p>
                    {hasOffer ? (
                      <p className="mt-2 text-xl font-bold">
                        <span className="text-red-500 line-through mr-2">
                          ${pkg.regularPrice}
                        </span>
                        <span className="text-green-600">
                          ${pkg.discountPrice}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-2 text-indigo-600 text-xl font-bold">
                        ${pkg.regularPrice}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Top Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Paris, France"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <h3 className="text-white text-2xl font-semibold">Paris</h3>
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=435&q=80"
                alt="Bali, Indonesia"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <h3 className="text-white text-2xl font-semibold">Bali</h3>
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"
                alt="New York, USA"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <h3 className="text-white text-2xl font-semibold">New York</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                “This travel service exceeded all my expectations! Every detail was taken care of, making my trip stress-free and truly memorable.”
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Sarah L.</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                “I had an amazing experience exploring new destinations. The packages offered were diverse and perfectly suited my adventurous spirit.”
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Mark T.</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                “A fantastic service with attention to detail! I loved every moment of my trip, and the team ensured I had a personalized experience.”
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Emily R.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section
        className="py-12 bg-blue-600"
        style={{ background: "linear-gradient(to right, #00b09b, #96c93d)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe for Exclusive Deals
          </h2>
          <p className="text-white mb-6">
            Join our newsletter and stay updated with the latest travel offers and destinations.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={subscribeLoading}
              className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-400 transition duration-300"
            >
              {subscribeLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      {/* ChatBot Component (integrated at the bottom) */}
      <ChatBot />

      {/* Popup Modal for subscription result */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className={`text-lg ${popup.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {popup.message}
            </p>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
