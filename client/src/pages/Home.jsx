//import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";


export default function Header() {
   // Assuming currentUser data is in Redux store
  
  return (
    <div>
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center text-center text-white h-full">
          <h2 className="text-4xl font-semibold">Explore Your Dream Destinations</h2>
          <p className="mt-4 text-lg">Find the best travel packages for your perfect getaway.</p>
          <Link to="/packages" className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-400">Start Your Journey</Link>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Featured Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mountain*/}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Package 1" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">Mountain Adventure</h3>
                <p className="mt-2 text-gray-600">Explore the best mountain retreats with breathtaking views.</p>
                <Link to="/package-detail" className="mt-4 text-yellow-500 hover:underline">View Details</Link>
              </div>
            </div>
            {/* Beach */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Package 2" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">Beach Paradise</h3>
                <p className="mt-2 text-gray-600">Relax at the most beautiful beaches and soak up the sun.</p>
                <Link to="/package-detail" className="mt-4 text-yellow-500 hover:underline">View Details</Link>
              </div>
            </div>
            {/* City */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1562608500-ada126c35593?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Package 3" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">City Escapes</h3>
                <p className="mt-2 text-gray-600">Discover the most vibrant cities and their hidden gems.</p>
                <Link to="/package-detail" className="mt-4 text-yellow-500 hover:underline">View Details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 WanderSphere. All Rights Reserved.</p>
          <div className="mt-4">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white mx-2">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
