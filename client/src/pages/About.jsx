export default function About() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-4xl font-semibold text-gray-800 mb-8">About Us</h2>
        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Welcome to WanderSphere, your ultimate travel companion. We are dedicated to offering unforgettable experiences that will take you to some of the most beautiful and hidden destinations around the world.
        </p>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Whether you’re looking for a relaxing beach getaway, an adventurous mountain retreat, or an exploration of vibrant cities, we have something for everyone. Our team works tirelessly to curate and craft the perfect travel packages for your dream vacation.
        </p>

        {/* Mission, Vision, Why Choose Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Mission */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              At WanderSphere, we aim to create personalized, hassle-free travel experiences that inspire exploration and connect people with the world’s diverse cultures and landscapes. Our mission is to help you discover your perfect getaway.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
            <ul className="list-disc text-gray-600 pl-5 space-y-2">
              <li>Expertly curated travel packages for all kinds of travelers</li>
              <li>Personalized itineraries to suit your preferences and budget</li>
              <li>Seamless booking process with 24/7 customer support</li>
              <li>Access to exclusive discounts and offers</li>
            </ul>
          </div>

          {/* Vision */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              Our vision is to become a leading global platform where travelers can discover, book, and experience the world’s best destinations. We believe in making travel more accessible, enjoyable, and enriching for everyone.
            </p>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="mt-16">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Meet the Team</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {/* Team Member 1 */}
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">John Doe</h4>
              <p className="text-gray-600">Founder & CEO</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1640531005390-38bd92755d6a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Jane Smith</h4>
              <p className="text-gray-600">Travel Specialist</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1563132337-f159f484226c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Sarah Johnson</h4>
              <p className="text-gray-600">Customer Support Lead</p>
            </div>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Follow Us</h3>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Stay connected with us on social media for the latest travel updates, exclusive offers, and inspiring travel stories.
          </p>
          <div className="flex justify-center gap-6">
            {/* Twitter */}
            <a
              href="https://twitter.com/WanderSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/WanderSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors duration-300"
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-gray-800">
      <path
        d="M12 2.162c3.29 0 3.67.012 4.95.071 1.28.058 2.37.261 3.22 1.114.854.854 1.057 1.944 1.114 3.22.059 1.28.071 1.66.071 4.95s-.012 3.67-.071 4.95c-.057 1.278-.26 2.368-1.114 3.222-.852.853-1.944 1.056-3.22 1.114-1.28.059-1.66.071-4.95.071s-3.67-.012-4.95-.071c-1.278-.058-2.368-.261-3.22-1.114-.853-.854-1.057-1.944-1.114-3.222-.059-1.28-.071-1.66-.071-4.95s.012-3.67.071-4.95c.057-1.278.26-2.368 1.114-3.22.852-.853 1.944-1.056 3.22-1.114 1.28-.059 1.66-.071 4.95-.071zm0 1.5c-3.29 0-3.67.012-4.95.071-1.22.058-2.29.23-3.12 1.053-.832.832-1.043 1.9-1.114 3.12-.059 1.28-.071 1.66-.071 4.95s.012 3.67.071 4.95c.057 1.22.261 2.29 1.114 3.12 1.024.824 1.92.995 3.12 1.053 1.28.059 1.66.071 4.95.071s3.67-.012 4.95-.071c1.22-.058 2.29-.23 3.12-1.053.832-.832 1.043-1.9 1.114-3.12.059-1.28.071-1.66.071-4.95s-.012-3.67-.071-4.95c-.057-1.22-.26-2.29-1.114-3.12-1.024-.823-1.9-.995-3.12-1.053-1.28-.059-1.66-.071-4.95-.071zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm5.125-.5a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
        fill="currentColor"
      />
    </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/WanderSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Join Us in Your Next Adventure</h3>
          <p className="text-lg text-gray-600 mb-6">
            Let us be a part of your journey. Whether you are booking your first trip or your next adventure, we are here to make your travel dreams a reality.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold hover:bg-gradient-to-l transition-colors duration-300"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
}