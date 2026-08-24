import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // Ya aap normal text "+" use kar sakte hain

export default function ManageAddresses() {
  // 🟢 1. Form show/hide karne ke liye state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    type: 'HOME'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddresses([...addresses, formData]);
    setShowAddressForm(false); // Form submit ke baad close karein
    setFormData({ name: '', phone: '', pincode: '', address: '', city: '', state: '', type: 'HOME' });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Manage Addresses</h2>

      {/* 🟢 2. Button par onClick listener attach karein */}
      {!showAddressForm && (
        <button
          onClick={() => setShowAddressForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-md uppercase tracking-wider transition flex items-center gap-2 mb-4"
        >
          <Plus size={16} />
          Add a New Address
        </button>
      )}

      {/* 🟢 3. Conditional Rendering: Jab state true ho tab form show karein */}
      {showAddressForm && (
        <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-4">ADD A NEW ADDRESS</h3>
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="p-2.5 border rounded-md text-sm w-full"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="10-digit mobile number"
                required
                className="p-2.5 border rounded-md text-sm w-full"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                required
                className="p-2.5 border rounded-md text-sm w-full"
                value={formData.pincode}
                onChange={handleChange}
              />
              <input
                type="text"
                name="locality"
                placeholder="Locality"
                className="p-2.5 border rounded-md text-sm w-full"
              />
            </div>
            <textarea
              name="address"
              placeholder="Address (Area and Street)"
              required
              rows={3}
              className="p-2.5 border rounded-md text-sm w-full"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-xs uppercase"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="text-blue-600 font-bold text-xs uppercase px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Addresses List */}
      {addresses.length === 0 && !showAddressForm ? (
        <div className="border border-gray-200 p-4 rounded-md text-gray-500 text-sm">
          No addresses saved yet.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr, idx) => (
            <div key={idx} className="border p-4 rounded-md">
              <p className="font-bold text-sm">{addr.name} ({addr.phone})</p>
              <p className="text-xs text-gray-600">{addr.address}, Pincode: {addr.pincode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}