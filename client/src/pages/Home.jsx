import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ChatBot from "../componets/ChatBot"; // Import the ChatBot component

export default function Home() {
  // Fetch packages from API (for dynamic travel experiences)
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
          height: "200vh", // Large height to enable smooth scroll animations
        }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-white px-4">
          <motion.h1
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-5xl md:text-6xl font-bold text-center"
          >
            Explore Your Dream Destinations
          </motion.h1>
          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mt-4 text-xl md:text-2xl max-w-2xl text-center"
          >
            Discover exclusive travel experiences and bespoke itineraries curated just for you.
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

      {/* Exclusive Travel Experiences Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Exclusive Travel Experiences
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Our curated experiences are designed to provide you with luxurious and authentic journeys. Enjoy hand-picked packages and personalized adventures.
          </p>
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading experiences...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg) => {
                // Check if the package has an offer
                const hasOffer = pkg.discountPrice && Number(pkg.discountPrice) < Number(pkg.regularPrice);
                return (
                  <motion.div
                    key={pkg._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden relative"
                  >
                    {hasOffer && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        OFFER
                      </span>
                    )}
                    <div className="relative">
                      <img
                        src={
                          pkg.imageUrls?.[0] ||
                          "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                        }
                        alt={pkg.title}
                        className="w-full h-56 object-cover"
                      />
                      {pkg.enabled ? (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <Link
                            to={`/package/${pkg._id}`}
                            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded"
                          >
                            View Details
                          </Link>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center">
                          <p className="text-white text-xl font-semibold">Unavailable</p>
                          <p className="text-gray-300 text-sm text-center px-2">This experience is not available at the moment.</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                      <p className="text-gray-600 mb-2">{pkg.destination}</p>
                      {hasOffer ? (
                        <p className="text-lg font-bold">
                          <span className="text-red-500 line-through mr-2">${pkg.regularPrice}</span>
                          <span className="text-green-600">${pkg.discountPrice}</span>
                        </p>
                      ) : (
                        <p className="text-indigo-600 text-lg font-bold">${pkg.regularPrice}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Why Choose Us
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Our commitment to personalized service, exclusive experiences, and seamless travel management makes us the premier choice for discerning travelers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Trusted Partnerships */}
            <div className="text-center p-6 bg-white rounded-lg shadow-xl">
              <img
                src="https://img.icons8.com/fluency/48/000000/handshake.png"
                alt="Trusted Partnerships"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trusted Partnerships</h3>
              <p className="text-gray-600">We work with top global partners to ensure the best quality and value.</p>
            </div>
            {/* Tailored Itineraries */}
            <div className="text-center p-6 bg-white rounded-lg shadow-xl">
              <img
                src="https://img.icons8.com/color/48/000000/trekking.png"
                alt="Tailored Itineraries"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tailored Itineraries</h3>
              <p className="text-gray-600">Every journey is personalized to meet your individual tastes and preferences.</p>
            </div>
            {/* 24/7 Support */}
            <div className="text-center p-6 bg-white rounded-lg shadow-xl">
              <img
                src="https://img.icons8.com/color/48/000000/customer-support.png"
                alt="24/7 Support"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated team is here to assist you before, during, and after your journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Travelers Say (Testimonials) Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-xl">
              <p className="text-gray-600 mb-4">
                “This travel service exceeded all my expectations! Every detail was taken care of, making my trip stress-free and truly memorable.”
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Sarah L.</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-xl">
              <p className="text-gray-600 mb-4">
                “I had an amazing experience exploring new destinations. The tailored itineraries suited my adventurous spirit perfectly.”
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Mark T.</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-xl">
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
            Join our newsletter and stay updated with the latest travel offers and insider tips.
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
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
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
