// src/pages/DestinationDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requestGuide, setRequestGuide] = useState(false);

  // Feedback states
  const [feedbackList, setFeedbackList] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchDestination() {
      try {
        const res = await fetch(`/api/destinations/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch destination");
        }
        setDestination(data.destination);
        // If the backend returns an array of feedback, store it
        if (data.destination.feedback) {
          setFeedbackList(data.destination.feedback);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDestination();
  }, [id]);

  // Handle booking
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select your travel dates.");
      return;
    }
    // Basic validation: endDate >= startDate, etc.
    // Send request to create a booking
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: id,
          startDate,
          endDate,
          requestGuide, // true or false
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed.");
      }
      toast.success("Booking successful!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle adding new feedback
  const handleAddFeedback = async () => {
    if (!newComment) {
      toast.error("Please enter your comment.");
      return;
    }
    try {
      const res = await fetch(`/api/destinations/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add feedback.");
      }
      toast.success("Feedback added!");
      setFeedbackList((prev) => [data.feedback, ...prev]); // data.feedback = new feedback item
      setNewComment("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading destination...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!destination) {
    return <div className="p-8 text-center">Destination not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">
        {destination.name}
      </h1>

      {/* Image Gallery */}
      {destination.imageUrls && destination.imageUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {destination.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={destination.name}
              className="w-full h-64 object-cover rounded shadow"
            />
          ))}
        </div>
      )}

      <p className="text-gray-700 mb-6">{destination.description}</p>

      {/* Booking Section */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Plan Your Trip</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={requestGuide}
              onChange={(e) => setRequestGuide(e.target.checked)}
            />
            <label>Request a Guide (optional)</label>
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>

      {/* Feedback Section */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>

        {/* Existing feedback */}
        {feedbackList.length === 0 ? (
          <p className="text-gray-600 mb-4">No feedback yet.</p>
        ) : (
          <ul className="space-y-4 mb-4">
            {feedbackList.map((fb, idx) => (
              <li key={idx} className="bg-white p-3 rounded shadow">
                <p className="text-gray-700">{fb.comment}</p>
                {/* If you store user info, you could show: "by {fb.user.username}" */}
              </li>
            ))}
          </ul>
        )}

        {/* Add new feedback */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Leave a comment..."
            className="border p-2 rounded flex-1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddFeedback}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
