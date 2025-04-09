import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookPackage() {
  const { id } = useParams(); // Package ID
  const navigate = useNavigate();

  const [packageDetails, setPackageDetails] = useState(null);
  const [travellers, setTravellers] = useState([
    {
      name: "",
      age: "",
      gender: "",
      country: "",
      contact: "",
      email: "",
    },
  ]);
  const [selectedPreferences, setSelectedPreferences] = useState([]); // For extra preferences selection
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showExtraPaymentModal, setShowExtraPaymentModal] = useState(false);

  // Fetch package details
  useEffect(() => {
    async function fetchPackageDetails() {
      try {
        const res = await fetch(`/api/listing/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch package details");
        }
        // Ensure preferences is defined as an array even if empty.
        if (!data.listing.preferences) {
          data.listing.preferences = [];
        }
        setPackageDetails(data.listing);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }
    fetchPackageDetails();
  }, [id]);

  // Calculate effective package price: use discount price if available and lower than regular.
  const packagePrice = packageDetails
    ? packageDetails.discountPrice &&
      Number(packageDetails.discountPrice) < Number(packageDetails.regularPrice)
      ? Number(packageDetails.discountPrice)
      : Number(packageDetails.regularPrice)
    : 0;

  // Calculate total amount.
  const totalAmount = travellers.reduce((total, traveller) => {
    const age = Number(traveller.age);
    if (age && age > 0) {
      return total + (age <= 5 ? packagePrice / 2 : packagePrice);
    }
    return total;
  }, 0);

  // Update traveller fields.
  const handleTravellerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTravellers = [...travellers];
    updatedTravellers[index][name] = value;
    setTravellers(updatedTravellers);
  };

  const addTraveller = () => {
    setTravellers([
      ...travellers,
      {
        name: "",
        age: "",
        gender: "",
        country: "",
        // Contact and email are omitted from the form for additional travellers.
      },
    ]);
  };

  const removeTraveller = (index) => {
    if (travellers.length > 1) {
      const updatedTravellers = travellers.filter((_, i) => i !== index);
      setTravellers(updatedTravellers);
    }
  };

  // Handle extra preference checkbox toggling.
  const handlePreferenceToggle = (pref) => {
    // Check if preference is already selected
    const isSelected = selectedPreferences.includes(pref);
    // Update selected preferences
    setSelectedPreferences((prev) =>
      isSelected ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
    // If this preference is newly selected, show the extra payment modal
    if (!isSelected) {
      setShowExtraPaymentModal(true);
    }
  };

  // Handle booking submission and redirect to PaymentPage.
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // For additional travellers (index > 0), prepopulate 'contact' and 'email' with the primary traveller's values.
    const modifiedTravellers = travellers.map((trav, index) => {
      if (index > 0) {
        return {
          ...trav,
          contact: travellers[0].contact,
          email: travellers[0].email,
        };
      }
      return trav;
    });

    const payload = {
      packageId: id,
      travellers: modifiedTravellers,
      selectedPreferences,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Booking API response:", data);
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }
      toast.success("Booking successful! Redirecting to payment page...");
      // Redirect to PaymentPage using the booking ID returned by backend.
      navigate(`/payment/${data.booking._id}`);
    } catch (error) {
      setErrorMsg(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (errorMsg) {
    return (
      <div className="container mx-auto p-4 text-red-600 text-center">
        {errorMsg}
      </div>
    );
  }
  if (!packageDetails) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading package details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modal for extra payment information */}
      {showExtraPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Additional Payment Notice</h2>
            <p className="mb-6">
              You have selected a special preference/dietary requirement. Please note that an extra payment will be required during your journey.
            </p>
            <button
              onClick={() => setShowExtraPaymentModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Book Package</h1>
        <div className="mb-4 text-xl font-semibold text-center">
          <span className="uppercase">Package Price:</span>{" "}
          {packageDetails.discountPrice &&
          Number(packageDetails.discountPrice) < Number(packageDetails.regularPrice) ? (
            <>
              <span className="line-through text-red-500 mr-2">
                ${Number(packageDetails.regularPrice).toFixed(2)}
              </span>
              <span className="text-green-600">
                ${Number(packageDetails.discountPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span>${Number(packageDetails.regularPrice).toFixed(2)}</span>
          )}
        </div>
        <form onSubmit={handleBooking} className="space-y-8">
          {travellers.map((traveller, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Traveller {index + 1}</h2>
                {travellers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTraveller(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={traveller.name}
                    onChange={(e) => handleTravellerChange(index, e)}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Age</label>
                  <input
                    type="number"
                    min="1"
                    name="age"
                    value={traveller.age}
                    onChange={(e) => handleTravellerChange(index, e)}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={traveller.gender}
                    onChange={(e) => handleTravellerChange(index, e)}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={traveller.country}
                    onChange={(e) => handleTravellerChange(index, e)}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                {/* Only render Contact No and Email for the first traveller */}
                {index === 0 && (
                  <>
                    <div>
                      <label className="block text-gray-700">Contact No</label>
                      <input
                        type="text"
                        name="contact"
                        value={traveller.contact}
                        onChange={(e) => handleTravellerChange(index, e)}
                        className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={traveller.email}
                        onChange={(e) => handleTravellerChange(index, e)}
                        className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {/* Extra Preferences Section (from Admin as checkboxes) */}
          {packageDetails.preferences && packageDetails.preferences.length > 0 && (
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">
                Select Special Preferences / Dietary Requirements:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {packageDetails.preferences.map((pref, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`pref-${index}`}
                      checked={selectedPreferences.includes(pref)}
                      onChange={() => handlePreferenceToggle(pref)}
                      className="mr-2"
                    />
                    <label htmlFor={`pref-${index}`} className="text-gray-700">
                      {pref}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addTraveller}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Add Another Traveller
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            {loading ? "Booking..." : "Submit Booking"}
          </button>
        </form>
        <div className="mt-4 text-center text-xl font-bold text-green-600">
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
