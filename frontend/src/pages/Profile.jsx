import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // API service import
import { 
  Package, 
  User, 
  CreditCard, 
  Folder, 
  Power, 
  ChevronRight, 
  HelpCircle, 
  Truck,
  Trash2,
  Plus
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('profile');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // UPI State
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    type: 'Home'
  });

  // User Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: ''
  });

  // Fetch User Profile from Backend on Component Mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: data.gender || 'Male',
          email: data.email || '',
          phone: data.phone || ''
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        // Fallback context data agar API available na ho
        if (user) {
          const nameParts = (user.name || '').split(' ');
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            gender: user.gender || 'Male',
            email: user.email || '',
            phone: user.phone || ''
          });
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Save handler for profile updates (backend call)
  const handleSave = async (type) => {
    try {
      await API.put('/users/profile', formData);
      if (type === 'name') setIsEditingName(false);
      if (type === 'email') setIsEditingEmail(false);
      if (type === 'phone') setIsEditingPhone(false);
      alert(`${type.toUpperCase()} details saved successfully!`);
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpi.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. username@upi)');
      return;
    }
    setUpiList([...upiList, newUpi]);
    setNewUpi('');
    setShowAddUpi(false);
    alert('UPI ID saved successfully!');
  };

  const handleDeleteUpi = (index) => {
    setUpiList(upiList.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen text-slate-800 py-4 px-2 md:px-12">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-4">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 flex flex-col gap-3">
          
          {/* User Header */}
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
              👦
            </div>
            <div>
              <p className="text-xs text-gray-500">Hello,</p>
              <h3 className="font-bold text-base text-gray-800 capitalize">
                {formData.firstName} {formData.lastName}
              </h3>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-sm shadow-sm">
            
            {/* My Orders */}
            <div 
              onClick={() => navigate('/orders')}
              className="flex justify-between items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-slate-50 text-gray-700 font-semibold"
            >
              <div className="flex items-center gap-3">
                <Package size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">MY ORDERS</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            {/* Account Settings */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-3 text-gray-700 font-semibold">
                <User size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">ACCOUNT SETTINGS</span>
              </div>
              <div className="flex flex-col text-sm">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`text-left px-12 py-2.5 text-xs ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  Profile Information
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`text-left px-12 py-2.5 text-xs ${activeTab === 'addresses' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  Manage Addresses
                </button>
              </div>
            </div>

            {/* Payments Options */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-3 text-gray-700 font-semibold">
                <CreditCard size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">PAYMENTS</span>
              </div>
              <div className="flex flex-col text-xs">
                <button 
                  onClick={() => setActiveTab('gift-cards')}
                  className={`flex justify-between items-center px-12 py-2.5 text-left ${activeTab === 'gift-cards' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  <span>Gift Cards</span>
                  <span className="text-green-600 font-bold">₹0</span>
                </button>
                <button 
                  onClick={() => setActiveTab('saved-upi')}
                  className={`text-left px-12 py-2.5 ${activeTab === 'saved-upi' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  Saved UPI
                </button>
                <button 
                  onClick={() => setActiveTab('saved-cards')}
                  className={`text-left px-12 py-2.5 ${activeTab === 'saved-cards' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  Saved Cards
                </button>
              </div>
            </div>

            {/* My Stuff Options */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-3 text-gray-700 font-semibold">
                <Folder size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">MY STUFF</span>
              </div>
              <div className="flex flex-col text-xs">
                <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`text-left px-12 py-2.5 ${activeTab === 'coupons' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  My Coupons
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`text-left px-12 py-2.5 ${activeTab === 'reviews' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  My Reviews & Ratings
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`text-left px-12 py-2.5 ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
                >
                  All Notifications
                </button>
                <button 
                  onClick={() => navigate('/wishlist')} 
                  className="text-left px-12 py-2.5 text-gray-600 hover:bg-slate-50"
                >
                  My Wishlist
                </button>
              </div>
            </div>

            {/* Logout */}
            <div 
              onClick={handleLogout}
              className="p-4 flex items-center gap-3 text-gray-700 font-semibold cursor-pointer hover:bg-slate-50"
            >
              <Power size={18} className="text-blue-600" />
              <span className="text-xs">Logout</span>
            </div>
          </div>

          {/* Frequently Visited */}
          <div className="bg-white p-4 rounded-sm shadow-sm text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-2">Frequently Visited:</p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/orders')} className="hover:underline flex items-center gap-1">
                <Truck size={12} /> Track Order
              </button>
              <button onClick={() => navigate('/customer-care')} className="hover:underline flex items-center gap-1">
                <HelpCircle size={12} /> Help Center
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-3/4 bg-white p-6 md:p-8 rounded-sm shadow-sm flex flex-col gap-8 min-h-[500px]">
          
          {/* Profile Information View */}
          {activeTab === 'profile' && (
            <>
              <div>
                <div className="flex items-center gap-6 mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                  <button 
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="text-blue-600 font-bold text-xs hover:underline"
                  >
                    {isEditingName ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 max-w-lg mb-4">
                  <input 
                    type="text" 
                    value={formData.firstName}
                    disabled={!isEditingName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
                  />
                  <input 
                    type="text" 
                    value={formData.lastName}
                    disabled={!isEditingName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
                  />
                </div>

                <p className="text-xs font-semibold text-gray-600 mb-2">Your Gender</p>
                <div className="flex items-center gap-6 text-sm text-gray-700 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Male" 
                      checked={formData.gender === 'Male'}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      disabled={!isEditingName}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Female" 
                      checked={formData.gender === 'Female'}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      disabled={!isEditingName}
                    />
                    Female
                  </label>
                </div>

                {isEditingName && (
                  <button 
                    onClick={() => handleSave('name')}
                    className="bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-sm shadow-sm hover:bg-blue-700"
                  >
                    SAVE
                  </button>
                )}
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center gap-6 mb-3">
                  <h2 className="text-lg font-bold text-gray-800">Email Address</h2>
                  <button 
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="text-blue-600 font-bold text-xs hover:underline"
                  >
                    {isEditingEmail ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="max-w-md flex flex-col gap-3">
                  <input 
                    type="email" 
                    value={formData.email}
                    placeholder="Enter email address"
                    disabled={!isEditingEmail}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
                  />
                  {isEditingEmail && (
                    <button 
                      onClick={() => handleSave('email')}
                      className="w-fit bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-sm shadow-sm hover:bg-blue-700"
                    >
                      SAVE
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <div className="flex items-center gap-6 mb-3">
                  <h2 className="text-lg font-bold text-gray-800">Mobile Number</h2>
                  <button 
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    className="text-blue-600 font-bold text-xs hover:underline"
                  >
                    {isEditingPhone ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="max-w-md flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={formData.phone}
                    disabled={!isEditingPhone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
                  />
                  {isEditingPhone && (
                    <button 
                      onClick={() => handleSave('phone')}
                      className="w-fit bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-sm shadow-sm hover:bg-blue-700"
                    >
                      SAVE
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Interactive Saved UPI View */}
          {activeTab === 'saved-upi' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="text-lg font-bold text-gray-800">Saved VPA / UPI</h2>
                <button 
                  onClick={() => setShowAddUpi(!showAddUpi)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <Plus size={14} /> {showAddUpi ? 'Cancel' : 'Add New VPA'}
                </button>
              </div>

              {showAddUpi && (
                <form onSubmit={handleAddUpi} className="max-w-md p-4 bg-slate-50 border border-gray-200 rounded-sm flex flex-col gap-3">
                  <label className="text-xs font-semibold text-gray-700">Enter VPA / UPI ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. mobileNumber@upi / username@okaxis" 
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    className="border border-gray-300 p-2.5 rounded-sm text-xs focus:outline-blue-500"
                    required
                  />
                  <button type="submit" className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-sm hover:bg-blue-700 w-fit">
                    SAVE VPA
                  </button>
                </form>
              )}

              {upiList.length === 0 ? (
                <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                  You have no saved UPI IDs.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {upiList.map((upi, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-sm text-xs text-gray-700 bg-slate-50">
                      <span className="font-semibold">{upi}</span>
                      <button onClick={() => handleDeleteUpi(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manage Addresses View */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Manage Addresses</h2>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-sm shadow-sm hover:bg-blue-700"
                >
                  {showAddressForm ? 'CANCEL' : '+ ADD A NEW ADDRESS'}
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setAddresses([...addresses, addressData]);
                  setShowAddressForm(false);
                  setAddressData({ name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home' });
                }} className="bg-slate-50 p-4 border border-gray-200 mb-4 rounded-sm flex flex-col gap-3">
                  <div className="flex gap-3">
                    <input 
                      type="text" placeholder="Name" required 
                      value={addressData.name} 
                      onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                    <input 
                      type="text" placeholder="10-digit mobile number" required 
                      value={addressData.phone} 
                      onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" placeholder="Pincode" required 
                      value={addressData.pincode} 
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                    <input 
                      type="text" placeholder="Locality" required 
                      value={addressData.locality} 
                      onChange={(e) => setAddressData({...addressData, locality: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                  </div>
                  <textarea 
                    placeholder="Address (Area and Street)" required 
                    value={addressData.address} 
                    onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                    className="p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500 h-20"
                  />
                  <div className="flex gap-3">
                    <input 
                      type="text" placeholder="City/District/Town" required 
                      value={addressData.city} 
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                    <input 
                      type="text" placeholder="State" required 
                      value={addressData.state} 
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                      className="w-1/2 p-2 border border-gray-300 text-xs rounded-sm focus:outline-blue-500" 
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold text-xs py-2 px-6 w-fit rounded-sm">
                    SAVE ADDRESS
                  </button>
                </form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                  No addresses saved yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {addresses.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-sm bg-white text-xs text-gray-700 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{item.name}</span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-semibold uppercase">{item.type}</span>
                        <span className="font-semibold ml-2">{item.phone}</span>
                      </div>
                      <p>{item.address}, {item.locality}, {item.city}, {item.state} - <span className="font-bold">{item.pincode}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gift Cards View */}
          {activeTab === 'gift-cards' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Gift Cards</h2>
              <div className="p-6 border border-gray-200 rounded-sm bg-slate-50 text-sm text-gray-600 flex justify-between items-center">
                <span>Current Gift Card Balance:</span>
                <span className="text-lg font-bold text-green-600">₹0</span>
              </div>
            </div>
          )}

          {/* Saved Cards View */}
          {activeTab === 'saved-cards' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Saved Cards</h2>
              <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                No saved debit or credit cards found.
              </div>
            </div>
          )}

          {/* Coupons View */}
          {activeTab === 'coupons' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Available Coupons</h2>
              <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                No active coupons available at the moment.
              </div>
            </div>
          )}

          {/* Reviews View */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">My Reviews & Ratings</h2>
              <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                You haven't submitted any product reviews yet.
              </div>
            </div>
          )}

          {/* Notifications View */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">All Notifications</h2>
              <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
                No new notifications.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}