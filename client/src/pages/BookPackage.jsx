import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookPackage() {
  const { id } = useParams(); // Package ID from the route

  const [packageDetails, setPackageDetails] = useState(null);
  const [travellers, setTravellers] = useState([
    {
      name: "",
      age: "",
      gender: "",
      country: "",
      preferences: "",
      contact: "",
      email: "",
      usePrevious: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch package details (including the price) from the backend.
  useEffect(() => {
    async function fetchPackageDetails() {
      try {
        const res = await fetch(`/api/listing/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies with the request
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch package details");
        }
        // Assume the backend returns an object with a "listing" field.
        setPackageDetails(data.listing);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }
    fetchPackageDetails();
  }, [id]);

  // Calculate total amount using the package price.
  // For each traveller: if age <= 5, charge half the package price; otherwise, full price.
  const packagePrice = packageDetails ? Number(packageDetails.regularPrice) : 0;
  const totalAmount = travellers.reduce((total, traveller) => {
    const age = Number(traveller.age);
    if (age && age > 0) {
      return total + (age <= 5 ? packagePrice / 2 : packagePrice);
    }
    return total;
  }, 0);

  // Update traveller's field by index.
  const handleTravellerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTravellers = [...travellers];
    updatedTravellers[index][name] = value;
    // If this traveller is set to use previous info, update contact and email accordingly.
    if (name !== "usePrevious" && index > 0 && updatedTravellers[index].usePrevious) {
      updatedTravellers[index].contact = updatedTravellers[index - 1].contact;
      updatedTravellers[index].email = updatedTravellers[index - 1].email;
    }
    setTravellers(updatedTravellers);
  };

  // Handler for "Same as previous" checkbox.
  const handleUsePreviousChange = (index, e) => {
    const isChecked = e.target.checked;
    setTravellers((prev) => {
      const updated = [...prev];
      updated[index].usePrevious = isChecked;
      if (isChecked && index > 0) {
        updated[index].contact = updated[index - 1].contact;
        updated[index].email = updated[index - 1].email;
      }
      return updated;
    });
  };

  // Add another traveller.
  const addTraveller = () => {
    setTravellers([
      ...travellers,
      {
        name: "",
        age: "",
        gender: "",
        country: "",
        preferences: "",
        contact: "",
        email: "",
        usePrevious: false,
      },
    ]);
  };

  // Remove a traveller (if more than one exists).
  const removeTraveller = (index) => {
    if (travellers.length > 1) {
      const updatedTravellers = travellers.filter((_, i) => i !== index);
      setTravellers(updatedTravellers);
    }
  };

  // Handle booking form submission.
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Build payload with packageId and travellers array.
    const payload = { packageId: id, travellers };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }
      toast.success(
        "Booking successful! Please make the payment within 7 days for admin approval."
      );
      // Optionally clear the form after successful booking.
      setTravellers([
        {
          name: "",
          age: "",
          gender: "",
          country: "",
          preferences: "",
          contact: "",
          email: "",
          usePrevious: false,
        },
      ]);
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

  // Wait until package details are fetched.
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
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Book Package</h1>
        
        {/* Package Price Section */}
        <div className="mb-4 text-xl font-semibold text-center">
          <span className="uppercase">Package Price:</span> ${packagePrice.toFixed(2)}
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
                <div className="md:col-span-2">
                  <label className="block text-gray-700">Preferences</label>
                  <textarea
                    name="preferences"
                    value={traveller.preferences}
                    onChange={(e) => handleTravellerChange(index, e)}
                    rows="3"
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Any special preferences or dietary requirements"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700">Contact No</label>
                  <input
                    type="text"
                    name="contact"
                    value={traveller.contact}
                    onChange={(e) => handleTravellerChange(index, e)}
                    disabled={index > 0 && traveller.usePrevious}
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
                    disabled={index > 0 && traveller.usePrevious}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                {index > 0 && (
                  <div className="md:col-span-2 flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="usePrevious"
                      checked={traveller.usePrevious || false}
                      onChange={(e) => handleUsePreviousChange(index, e)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm">
                      Same as previous
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
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
        {/* Total Amount displayed below the form */}
        <div className="mt-4 text-center text-xl font-bold text-green-600">
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
        <div className="mt-2 text-center text-sm text-gray-700">
          Please make the payment within 7 days for admin approval.
        </div>
      </div>
    </div>
  );
}
