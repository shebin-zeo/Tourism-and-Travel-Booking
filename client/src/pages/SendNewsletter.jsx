import { useState } from "react";

export default function SendNewsletter() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Opens Cloudinary widget to upload a new image
  const openCloudinaryWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: "drqoa7h5u", // Your Cloudinary cloud name
          uploadPreset: "news_letter", // Your unsigned upload preset
          sources: ["local", "url", "camera", "image_search", "facebook", "dropbox"],
          multiple: false,
          folder: "news_letter",
          cropping: false,
          defaultSource: "local"
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setBannerImage(result.info.secure_url);
          }
        }
      );
      widget.open();
    } else {
      alert("Cloudinary widget is not available");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, bannerImage }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Newsletter sending failed");
      }
      setMessage("Newsletter sent successfully! Emails have been dispatched.");
      setSubject("");
      setContent("");
      setBannerImage("");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Send Newsletter</h1>
        <p className="text-gray-600 mb-6">
          Compose your newsletter below. The content will be sent to all subscribed users.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter newsletter subject"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-40"
              placeholder="Write your newsletter content here..."
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Banner Image URL (optional)</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://res.cloudinary.com/yourcloudname/image/upload/v123456/banner.jpg"
              />
              <button
                type="button"
                onClick={openCloudinaryWidget}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Upload New
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300"
          >
            {sending ? "Sending..." : "Send Newsletter"}
          </button>
          {message && <p className="mt-4 text-center text-lg text-green-600">{message}</p>}
          {errorMsg && <p className="mt-4 text-center text-lg text-red-600">{errorMsg}</p>}
        </form>

        {/* Preview Section */}
        {(subject || content || bannerImage) && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Newsletter Preview
            </h2>
            <div
              style={{ fontFamily: "Arial, sans-serif" }}
              className="max-w-md mx-auto bg-gray-100 p-4 rounded shadow"
            >
              <header style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src="/logomail.png"
                  alt="Logo"
                  className="mx-auto mb-2"
                  style={{ maxWidth: "150px" }}
                />
                <h1 className="text-2xl text-gray-800">
                  {subject || "Newsletter Subject"}
                </h1>
              </header>
              <main className="mb-4">
                <img
                  src={
                    bannerImage ||
                    "https://via.placeholder.com/600x200?text=Newsletter+Banner"
                  }
                  alt="Banner"
                  className="w-full h-auto mb-4 rounded"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x200?text=Newsletter+Banner";
                  }}
                />
                <p className="text-gray-700 text-base leading-relaxed">
                  {content || "Newsletter content will appear here..."}
                </p>
              </main>
              <footer style={{ textAlign: "center", fontSize: "0.875rem", color: "#6c757d" }}>
                <p>Thank you for being a valued subscriber.</p>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
