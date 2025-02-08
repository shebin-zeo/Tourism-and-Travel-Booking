import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            Explore Your Dream Destinations
          </h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl">
            Find the best travel packages and experience unforgettable adventures with us.
          </p>
          <Link
            to="/packages"
            className="mt-8 inline-block bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-400 transition duration-300"
          >
            Start Your Journey
          </Link>
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
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Package Image with Hover Overlay */}
                <div className="relative">
                  <img
                    src={pkg.imageUrls?.[0] || "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"}
                    alt={pkg.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      to={`/package/${pkg._id}`}
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                {/* Package Information */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.destination}</p>
                  <p className="text-green-600 text-xl font-bold">
                    ${pkg.regularPrice}
                  </p>
                </div>
              </div>
            ))}
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
                src="https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Paris, France"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <h3 className="text-white text-2xl font-semibold">Paris</h3>
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=435&q=80"
                alt="Bali, Indonesia"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <h3 className="text-white text-2xl font-semibold">Bali</h3>
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
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
              &ldquo;This travel service exceeded all my expectations! Every detail was taken care of, making my trip stress-free and truly memorable.&rdquo;
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Sarah L.</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
              &ldquo;I had an amazing experience exploring new destinations. The packages offered were diverse and perfectly suited my adventurous spirit.&rdquo;
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Mark T.</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
              &ldquo;A fantastic service with attention to detail! I loved every moment of my trip, and the team ensured I had a personalized experience.&rdquo;
              </p>
              <h4 className="text-lg font-bold text-gray-800">- Emily R.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-12 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe for Exclusive Deals
          </h2>
          <p className="text-white mb-6">
            Join our newsletter and stay updated with the latest travel offers and destinations.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-400 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}