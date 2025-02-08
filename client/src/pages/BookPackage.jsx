// BookPackage.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BookPackage() {
  const { id } = useParams(); // Package ID from route parameter

  // Initialize the travellers state with one traveller object.
  const [travellers, setTravellers] = useState([
    {
      name: '',
      age: '',
      gender: '',
      country: '',
      preferences: '',
      contact: '',
      email: '',
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update traveller's field by index
  const handleTravellerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTravellers = [...travellers];
    updatedTravellers[index][name] = value;
    setTravellers(updatedTravellers);
  };

  // Add another traveller object to the state array
  const addTraveller = () => {
    setTravellers([
      ...travellers,
      {
        name: '',
        age: '',
        gender: '',
        country: '',
        preferences: '',
        contact: '',
        email: '',
      },
    ]);
  };

  // Remove a traveller (only if there is more than one)
  const removeTraveller = (index) => {
    if (travellers.length > 1) {
      const updatedTravellers = travellers.filter((_, i) => i !== index);
      setTravellers(updatedTravellers);
    }
  };

  // Handle booking form submission
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Build payload with packageId and travellers array.
    const payload = { packageId: id, travellers };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking failed');
      }
      setSuccessMsg('Booking successful!');
      // Optionally clear the form after a successful booking:
      setTravellers([
        {
          name: '',
          age: '',
          gender: '',
          country: '',
          preferences: '',
          contact: '',
          email: '',
        },
      ]);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Book Package</h1>
        
        {successMsg && <p className="text-green-600 mb-4 text-center">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mb-4 text-center">{errorMsg}</p>}
        
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
                    className="mt-1 w-full p-2 border rounded"
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
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={traveller.gender}
                    onChange={(e) => handleTravellerChange(index, e)}
                    className="mt-1 w-full p-2 border rounded"
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
                    className="mt-1 w-full p-2 border rounded"
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
                    className="mt-1 w-full p-2 border rounded"
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
                    className="mt-1 w-full p-2 border rounded"
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
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
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
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            {loading ? 'Booking...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
