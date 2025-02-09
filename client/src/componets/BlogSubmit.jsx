// components/BlogSubmit.js
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BlogSubmit() {
  // Always call hooks at the top
  const { currentUser } = useSelector((state) => state.user);

  // Local state for the form (username is now taken from currentUser)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    review: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Redirect if no user is logged in
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  // Handle input changes for title, content, and review
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cloudinary image upload function
  const handleImageSubmit = () => {
    if (formData.images.length >= 6) {
      setImageUploadError('You can only upload 6 images per post');
      return;
    }
    setUploading(true);
    setImageUploadError('');

    window.cloudinary.openUploadWidget(
      {
        cloud_name: 'drqoa7h5u', // Replace with your Cloudinary cloud name
        upload_preset: 'Blogs_review', // Replace with your upload preset
        sources: ['local', 'url', 'camera'],
        folder: 'Blogs_review', // Your Cloudinary folder name
        multiple: true,
        max_files: 6 - formData.images.length,
      },
      (error, result) => {
        if (error) {
          setImageUploadError('Image upload failed');
          setUploading(false);
          return;
        }
        if (result.event === 'success') {
          // Append the secure URL from Cloudinary to the images array
          setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, result.info.secure_url],
          }));
        }
        if (result.event === 'close') {
          setUploading(false);
        }
      }
    );
  };

  // Remove an image from the images list
  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  // Submit the blog post
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build the payload with the logged-in user's details
    const payload = {
      ...formData,
      username: currentUser.username, // Automatically taken from currentUser
      author: currentUser._id,          // The user's MongoDB _id reference
    };

    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit blog post');
      }
      toast.success('Blog submitted successfully! Await admin approval.');
      // Reset the form (username remains managed by currentUser)
      setFormData({
        title: '',
        content: '',
        review: '',
        images: [],
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* ToastContainer renders pop-up notifications */}
      <ToastContainer position="top-center" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-6">Submit Your Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded p-6">
        <div>
          <label className="block font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={currentUser.username}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your blog title"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog content here..."
            rows="5"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-2">Review (Optional)</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a review or summary (optional)"
            rows="3"
          ></textarea>
        </div>
        <div>
          <button
            type="button"
            onClick={handleImageSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading Images...' : 'Upload Images'}
          </button>
          {imageUploadError && (
            <p className="text-red-600 mt-2">{imageUploadError}</p>
          )}
        </div>
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Blog Post
        </button>
      </form>
    </div>
  );
}
