import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/blog', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch blog posts');
        }
        setBlogPosts(data.blogPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading blog posts...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (blogPosts.length === 0) return <p className="text-center mt-8">No blog posts available.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {post.images && post.images.length > 0 && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <Link to={`/blog/${post._id}`} className="mt-4 inline-block text-yellow-500 hover:underline">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
