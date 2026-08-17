import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  CreditCard, 
  Folder, 
  Power, 
  ChevronRight, 
  HelpCircle, 
  Truck 
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // AuthContext or Fallback state
  const currentUser = user || {
    name: 'Prakash Singh',
    email: 'prakash@example.com',
    phone: '+919236894256',
    gender: 'Male'
  };

  const nameParts = (currentUser.name || 'Prakash Singh').split(' ');
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || 'Prakash',
    lastName: nameParts.slice(1).join(' ') || 'Singh',
    gender: currentUser.gender || 'Male',
    email: currentUser.email || '',
    phone: currentUser.phone || '+919236894256'
  });

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
              <h3 className="font-bold text-base text-gray-800">
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
                <button className="text-left px-12 py-2.5 bg-blue-50 text-blue-600 font-semibold text-xs">
                  Profile Information
                </button>
                <button 
                  onClick={() => navigate('/addresses')}
                  className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600 text-xs"
                >
                  Manage Addresses
                </button>
                <button 
                  onClick={() => navigate('/pan-card')}
                  className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600 text-xs"
                >
                  PAN Card Information
                </button>
              </div>
            </div>

            {/* Payments */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-3 text-gray-700 font-semibold">
                <CreditCard size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">PAYMENTS</span>
              </div>
              <div className="flex flex-col text-xs">
                <div className="flex justify-between items-center px-12 py-2.5 hover:bg-slate-50 text-gray-600 cursor-pointer">
                  <span>Gift Cards</span>
                  <span className="text-green-600 font-bold">₹0</span>
                </div>
                <button className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">Saved UPI</button>
                <button className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">Saved Cards</button>
              </div>
            </div>

            {/* My Stuff */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-3 text-gray-700 font-semibold">
                <Folder size={18} className="text-blue-600" />
                <span className="text-xs uppercase tracking-wide">MY STUFF</span>
              </div>
              <div className="flex flex-col text-xs">
                <button className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">My Coupons</button>
                <button className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">My Reviews & Ratings</button>
                <button className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">All Notifications</button>
                <button onClick={() => navigate('/wishlist')} className="text-left px-12 py-2.5 hover:bg-slate-50 text-gray-600">My Wishlist</button>
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
        <div className="w-full md:w-3/4 bg-white p-6 md:p-8 rounded-sm shadow-sm flex flex-col gap-8">
          
          {/* Personal Information */}
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
            <div className="flex items-center gap-6 text-sm text-gray-700">
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
            <div className="max-w-md">
              <input 
                type="email" 
                value={formData.email}
                placeholder="Enter email address"
                disabled={!isEditingEmail}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
              />
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
            <div className="max-w-md">
              <input 
                type="text" 
                value={formData.phone}
                disabled={!isEditingPhone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded-sm bg-slate-50 text-gray-700 focus:outline-blue-500 disabled:opacity-70 text-sm"
              />
            </div>
          </div>

          {/* FAQs & Account Management */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-base text-gray-800 mb-4">FAQs</h3>
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <div>
                <p className="font-bold text-gray-800 mb-1">What happens when I update my email address (or mobile number)?</p>
                <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">When will my Flipkart account be updated with the new email address (or mobile number)?</p>
                <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">What happens to my existing Flipkart account when I update my email address (or mobile number)?</p>
                <p>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Does my Seller account get affected when I update my email address?</p>
                <p>Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button className="text-left text-xs font-bold text-blue-600 hover:underline">Deactivate Account</button>
              <button className="text-left text-xs font-bold text-red-500 hover:underline">Delete Account</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}