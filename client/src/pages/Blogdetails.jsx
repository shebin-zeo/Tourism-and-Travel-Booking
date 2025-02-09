import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BlogDetail() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch blog post');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
      {blogPost.images && blogPost.images.length > 0 && (
        <img src={blogPost.images[0]} alt={blogPost.title} className="w-full h-96 object-cover rounded-lg mb-4" />
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
