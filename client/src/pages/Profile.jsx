import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axiosClient } from '../api/axiosClient';
import { logout } from '../redux/slice/authSlice';
import { 
  Package, 
  User, 
  CreditCard, 
  Power, 
  ChevronRight, 
  Truck,
  Trash2,
  Plus,
  Loader2,
  Heart,
  Sparkles,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth?.user);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);

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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: '',
    businessName: ''
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users/profile');
      const userData = res.data?.user || res.data || reduxUser || {};
      
      const nameParts = (userData.name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        gender: userData.gender || 'Male',
        email: userData.email || '',
        phone: userData.phone || '',
        businessName: userData.businessName || ''
      });

      if (userData.addresses && Array.isArray(userData.addresses)) {
        setAddresses(userData.addresses);
      }
    } catch (err) {
      console.warn('Could not fetch server profile, using local state:', err);
      if (reduxUser) {
        const nameParts = (reduxUser.name || '').split(' ');
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          gender: reduxUser.gender || 'Male',
          email: reduxUser.email || '',
          phone: reduxUser.phone || '',
          businessName: reduxUser.businessName || ''
        });
      }
    } finally {
      setLoading(false);
    }
  }, [reduxUser]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveProfile = async (type) => {
    try {
      setSaving(true);
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        businessName: formData.businessName
      };

      await axiosClient.put('/users/profile', payload);
      if (type === 'name') setIsEditingName(false);
      if (type === 'email') setIsEditingEmail(false);
      if (type === 'phone') setIsEditingPhone(false);
      toast.success(`${type ? type.toUpperCase() : 'Profile'} updated successfully!`);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await axiosClient.post('/users/addresses', addressData);
      const updatedAddrs = data?.addresses || [...addresses, data || addressData];
      setAddresses(updatedAddrs);
      setShowAddressForm(false);
      setAddressData({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        type: 'Home'
      });
      toast.success('Address saved successfully!');
    } catch (err) {
      console.error("Error saving address:", err);
      setAddresses(prev => [...prev, addressData]);
      setShowAddressForm(false);
      toast.success('Address saved locally!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index, addressId) => {
    try {
      if (addressId) {
        await axiosClient.delete(`/users/addresses/${addressId}`);
      }
      setAddresses(prev => prev.filter((_, i) => i !== index));
      toast.success('Address removed');
    } catch (err) {
      console.error("Error deleting address:", err);
      setAddresses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpi.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }
    setUpiList([...upiList, newUpi]);
    setNewUpi('');
    setShowAddUpi(false);
    toast.success('UPI ID saved!');
  };

  const handleDeleteUpi = (index) => {
    setUpiList(upiList.filter((_, i) => i !== index));
    toast.success('UPI ID removed');
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      console.warn('Server logout error:', err);
    } finally {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userInfo');
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-8 px-4 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          
          {/* User Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl">
              {formData.firstName ? formData.firstName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Welcome,</p>
              <h3 className="font-extrabold text-base text-white capitalize">
                {formData.firstName || 'Marketplace'} {formData.lastName || 'Member'}
              </h3>
              <p className="text-[10px] text-indigo-400 font-medium">{formData.email || 'Verified Account'}</p>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden divide-y divide-slate-800/60">
            
            <div 
              onClick={() => navigate('/my-orders')}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/50 text-slate-200 font-semibold transition"
            >
              <div className="flex items-center gap-3">
                <Package size={18} className="text-indigo-400" />
                <span className="text-xs uppercase tracking-wider">My Orders</span>
              </div>
              <ChevronRight size={16} className="text-slate-500" />
            </div>

            <div>
              <div className="p-4 flex items-center gap-3 text-slate-400 font-semibold">
                <User size={18} className="text-indigo-400" />
                <span className="text-xs uppercase tracking-wider">Account Settings</span>
              </div>
              <div className="flex flex-col pb-2 text-xs">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`text-left px-12 py-2.5 transition ${activeTab === 'profile' ? 'bg-indigo-600/20 text-indigo-400 font-bold border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
                >
                  Personal Information
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`text-left px-12 py-2.5 transition ${activeTab === 'addresses' ? 'bg-indigo-600/20 text-indigo-400 font-bold border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
                >
                  Manage Addresses
                </button>
              </div>
            </div>

            <div>
              <div className="p-4 flex items-center gap-3 text-slate-400 font-semibold">
                <CreditCard size={18} className="text-indigo-400" />
                <span className="text-xs uppercase tracking-wider">Payments</span>
              </div>
              <div className="flex flex-col pb-2 text-xs">
                <button 
                  onClick={() => setActiveTab('saved-upi')}
                  className={`text-left px-12 py-2.5 transition ${activeTab === 'saved-upi' ? 'bg-indigo-600/20 text-indigo-400 font-bold border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
                >
                  Saved UPI Handles
                </button>
                <button 
                  onClick={() => setActiveTab('saved-cards')}
                  className={`text-left px-12 py-2.5 transition ${activeTab === 'saved-cards' ? 'bg-indigo-600/20 text-indigo-400 font-bold border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
                >
                  Saved Cards
                </button>
              </div>
            </div>

            <div>
              <div className="p-4 flex items-center gap-3 text-slate-400 font-semibold">
                <Sparkles size={18} className="text-amber-400" />
                <span className="text-xs uppercase tracking-wider">Rewards & Wishlist</span>
              </div>
              <div className="flex flex-col pb-2 text-xs">
                <button 
                  onClick={() => navigate('/wishlist')} 
                  className="flex items-center justify-between px-12 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/30 transition text-left"
                >
                  <span className="flex items-center gap-2"><Heart size={14} /> My Wishlist</span>
                </button>
                <button 
                  onClick={() => navigate('/plus-zone')} 
                  className="flex items-center justify-between px-12 py-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/30 transition text-left"
                >
                  <span className="flex items-center gap-2"><Sparkles size={14} /> VIP Plus Zone</span>
                </button>
              </div>
            </div>

            <div 
              onClick={handleLogout}
              className="p-4 flex items-center gap-3 text-rose-400 font-semibold cursor-pointer hover:bg-rose-950/20 transition"
            >
              <Power size={18} />
              <span className="text-xs uppercase tracking-wider">Logout</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl text-xs text-slate-400">
            <p className="font-bold text-slate-200 mb-2">Need Help?</p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/my-orders')} className="hover:text-indigo-400 flex items-center gap-1">
                <Truck size={12} /> Track Order
              </button>
              <button onClick={() => navigate('/customer-care')} className="hover:text-indigo-400 flex items-center gap-1">
                Help Center
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col gap-6 min-h-[500px]">
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 size={36} className="animate-spin text-indigo-500" />
              <p className="text-xs text-slate-400">Loading your profile details...</p>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  
                  {/* Personal Information */}
                  <div className="border-b border-slate-800 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold text-white">Personal Information</h2>
                        <p className="text-xs text-slate-400">Your name and identity details</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingName(!isEditingName)}
                        className="text-indigo-400 font-bold text-xs hover:text-indigo-300"
                      >
                        {isEditingName ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mb-4">
                      <input 
                        type="text" 
                        placeholder="First Name"
                        value={formData.firstName}
                        disabled={!isEditingName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60 text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Last Name"
                        value={formData.lastName}
                        disabled={!isEditingName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60 text-xs"
                      />
                    </div>

                    <p className="text-xs font-semibold text-slate-400 mb-2">Gender</p>
                    <div className="flex items-center gap-6 text-xs text-slate-300 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Male" 
                          checked={formData.gender === 'Male'}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          disabled={!isEditingName}
                          className="accent-indigo-500"
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
                          className="accent-indigo-500"
                        />
                        Female
                      </label>
                    </div>

                    {isEditingName && (
                      <button 
                        onClick={() => handleSaveProfile('name')}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    )}
                  </div>

                  {/* Email */}
                  <div className="border-b border-slate-800 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-base font-bold text-white">Email Address</h2>
                        <p className="text-xs text-slate-400">Used for transactional notifications and invoices</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                        className="text-indigo-400 font-bold text-xs hover:text-indigo-300"
                      >
                        {isEditingEmail ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    <div className="max-w-md flex flex-col gap-3">
                      <input 
                        type="email" 
                        value={formData.email}
                        disabled={!isEditingEmail}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60 text-xs"
                      />
                      {isEditingEmail && (
                        <button 
                          onClick={() => handleSaveProfile('email')}
                          disabled={saving}
                          className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
                        >
                          {saving ? 'Saving...' : 'Save Email'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-base font-bold text-white">Mobile Number</h2>
                        <p className="text-xs text-slate-400">Used for dispatch alerts and logistics communication</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingPhone(!isEditingPhone)}
                        className="text-indigo-400 font-bold text-xs hover:text-indigo-300"
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
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60 text-xs"
                      />
                      {isEditingPhone && (
                        <button 
                          onClick={() => handleSaveProfile('phone')}
                          disabled={saving}
                          className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
                        >
                          {saving ? 'Saving...' : 'Save Phone'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Delivery Addresses</h2>
                      <p className="text-xs text-slate-400">Manage destination addresses for fast bulk checkout</p>
                    </div>
                    <button 
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Plus size={14} /> {showAddressForm ? 'Cancel' : 'Add New Address'}
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="bg-slate-950 p-5 border border-slate-800 rounded-2xl flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" placeholder="Contact Person / Facility Name" required 
                          value={addressData.name} 
                          onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                        <input 
                          type="text" placeholder="10-digit mobile number" required 
                          value={addressData.phone} 
                          onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" placeholder="Pincode / Postal Code" required 
                          value={addressData.pincode} 
                          onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                        <input 
                          type="text" placeholder="Locality / Landmark" required 
                          value={addressData.locality} 
                          onChange={(e) => setAddressData({...addressData, locality: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                      </div>
                      <textarea 
                        placeholder="Street Address / Factory / Warehouse details" required 
                        value={addressData.address} 
                        onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                        className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" placeholder="City" required 
                          value={addressData.city} 
                          onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                        <input 
                          type="text" placeholder="State" required 
                          value={addressData.state} 
                          onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                          className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500" 
                        />
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Address Type</label>
                        <div className="flex gap-6 text-xs text-slate-300">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addressType" 
                              value="Home" 
                              checked={addressData.type === 'Home'}
                              onChange={(e) => setAddressData({...addressData, type: e.target.value})}
                              className="accent-indigo-500"
                            />
                            Office / Headquarter
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addressType" 
                              value="Work" 
                              checked={addressData.type === 'Work'}
                              onChange={(e) => setAddressData({...addressData, type: e.target.value})}
                              className="accent-indigo-500"
                            />
                            Warehouse / Factory
                          </label>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 w-fit rounded-xl transition mt-2"
                      >
                        {saving ? 'Saving...' : 'Save Address'}
                      </button>
                    </form>
                  )}

                  {addresses.length === 0 ? (
                    <div className="p-8 border border-slate-800 rounded-2xl text-xs text-slate-500 text-center">
                      <MapPin size={32} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                      No saved addresses yet. Click "+ Add New Address" above to register a shipping destination.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {addresses.map((item, index) => (
                        <div key={item._id || index} className="p-4 border border-slate-800 rounded-2xl bg-slate-950 text-xs text-slate-300 flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{item.name}</span>
                              <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">{item.type}</span>
                              <span className="text-slate-400 ml-2 font-mono">{item.phone}</span>
                            </div>
                            <p className="text-slate-400">{item.address}, {item.locality}, {item.city}, {item.state} - <strong className="text-slate-200">{item.pincode}</strong></p>
                          </div>
                          <button 
                            onClick={() => handleDeleteAddress(index, item._id)} 
                            className="text-slate-500 hover:text-rose-400 p-1.5 transition"
                            title="Delete address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'saved-upi' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Saved VPA / UPI Handles</h2>
                      <p className="text-xs text-slate-400">Quick-checkout UPI Virtual Payment Addresses</p>
                    </div>
                    <button 
                      onClick={() => setShowAddUpi(!showAddUpi)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <Plus size={14} /> {showAddUpi ? 'Cancel' : 'Add New VPA'}
                    </button>
                  </div>

                  {showAddUpi && (
                    <form onSubmit={handleAddUpi} className="max-w-md p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3">
                      <label className="text-xs font-semibold text-slate-300">Enter UPI ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. business@okhdfcbank" 
                        value={newUpi}
                        onChange={(e) => setNewUpi(e.target.value)}
                        className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl w-fit transition">
                        Save VPA
                      </button>
                    </form>
                  )}

                  {upiList.length === 0 ? (
                    <div className="p-8 border border-slate-800 rounded-2xl text-xs text-slate-500 text-center">
                      No saved UPI IDs. You can use any UPI app during checkout.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {upiList.map((upi, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-slate-800 rounded-xl text-xs text-slate-300 bg-slate-950">
                          <span className="font-mono text-indigo-400">{upi}</span>
                          <button onClick={() => handleDeleteUpi(index)} className="text-slate-500 hover:text-rose-400 transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'saved-cards' && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Saved Cards</h2>
                  <div className="p-8 border border-slate-800 rounded-2xl text-xs text-slate-500 text-center">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                    Cards are securely processed through Razorpay's PCI-DSS compliant vault during checkout.
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}