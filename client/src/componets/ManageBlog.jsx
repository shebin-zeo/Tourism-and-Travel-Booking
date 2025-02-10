// src/components/ManageBlog.jsx
import { useState, useEffect } from "react";
import { FaCheck, FaTrash, FaTimes, FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const [selectedBlogToView, setSelectedBlogToView] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/blog/admin/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
          // Include credentials if needed:
          // credentials: "include"
        });
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON. Please check the backend.");
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blog posts");
        }
        // Expecting data.blogPosts to contain blog posts with populated 'author'
        setBlogs(data.blogPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Approve a blog post.
  async function handleApprove(blogId) {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/blog/admin/approve/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        // credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to approve blog post");
      }
      toast.success("Blog post approved successfully!");
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, approved: true } : blog
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Open the delete modal.
  function openDeleteModal(blogId) {
    setSelectedBlogToDelete(blogId);
    setShowDeleteModal(true);
  }

  // Close the delete modal.
  function closeDeleteModal() {
    setSelectedBlogToDelete(null);
    setShowDeleteModal(false);
  }

  // Confirm deletion.
  async function confirmDelete() {
    if (!selectedBlogToDelete) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/blog/admin/${selectedBlogToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        // credentials: "include"
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON on deletion.");
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete blog post");
      }
      toast.success("Blog post rejected and deleted successfully!");
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== selectedBlogToDelete)
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeDeleteModal();
    }
  }

  // Open view modal.
  function openViewModal(blog) {
    setSelectedBlogToView(blog);
  }

  // Close view modal.
  function closeViewModal() {
    setSelectedBlogToView(null);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading blog posts...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Blog Approvals
      </h1>
      {blogs.length === 0 ? (
        <p className="text-center">No blog posts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-200">
              <tr>
                <th className="px-4 py-2 border">Blog ID</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Author</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border text-sm">{blog._id}</td>
                  <td className="px-4 py-2 border text-sm">{blog.title}</td>
                  <td className="px-4 py-2 border text-sm">
                    {blog.author && blog.author.username
                      ? blog.author.username
                      : blog.author && blog.author.email
                      ? blog.author.email
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {blog.approved ? "Approved" : "Pending"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(blog)}
                        className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition duration-200"
                      >
                        <FaEye className="mr-1" /> View Content
                      </button>
                      {!blog.approved && (
                        <button
                          onClick={() => handleApprove(blog._id)}
                          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(blog._id)}
                        className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                      >
                        <FaTrash className="mr-1" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBlogToView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeViewModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-indigo-600">
                {selectedBlogToView.title}
              </h2>
              <button onClick={closeViewModal} className="text-gray-600 hover:text-gray-900">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">{selectedBlogToView.content}</p>
            </div>
            {selectedBlogToView.review && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg border">
                <h3 className="text-2xl font-semibold mb-2">Review</h3>
                <p className="text-gray-700">{selectedBlogToView.review}</p>
              </div>
            )}
            {selectedBlogToView.images && selectedBlogToView.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBlogToView.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Blog image ${index + 1}`}
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center">
              <FaTrash className="mr-2" /> Confirm Rejection
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to reject (delete) this blog post?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200 shadow"
              >
                <FaTrash className="mr-1" /> Yes, Reject
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-full flex items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200 shadow"
              >
                <FaTimes className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </main>
  );
}
