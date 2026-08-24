import { useState, useEffect } from 'react';
import { Building2, Phone, MapPin, Clock, FileText, Save, CheckCircle2 } from 'lucide-react';

export default function SupplierProfile() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Get current logged-in user ID from localStorage
  const userId = localStorage.getItem('userId') || '';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [profile, setProfile] = useState({
    businessName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    gstin: '',
    description: ''
  });

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/users/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          businessName: data.businessName || '',
          phone: data.phone || '',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          operatingHours: data.operatingHours || 'Mon - Sat: 9:00 AM - 7:00 PM',
          gstin: data.gstin || '',
          description: data.description || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const payload = {
      businessName: profile.businessName,
      phone: profile.phone,
      address: {
        street: profile.street,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode
      },
      operatingHours: profile.operatingHours,
      gstin: profile.gstin,
      description: profile.description
    };

    try {
      const res = await fetch(`${apiUrl}/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="text-indigo-400" size={24} /> Supplier Profile Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your official business details, contact info, and operating hours</p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          
          {/* Section 1: Business Identity */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Building2 size={16} className="text-indigo-400" /> Business Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Business / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Textile Mills Pvt Ltd"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">GSTIN / Tax ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 09AAAAA0000A1Z5"
                  value={profile.gstin}
                  onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Operating Hours */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Phone size={16} className="text-indigo-400" /> Contact & Operating Hours
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Operating Hours *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon - Sat: 9:00 AM - 7:00 PM"
                  value={profile.operatingHours}
                  onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Business Address */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-400" /> Business Address
            </h2>

            <input
              type="text"
              placeholder="Street Address / Plot / Industrial Area"
              value={profile.street}
              onChange={(e) => setProfile({ ...profile, street: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="State"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 4: Additional Information (Bio) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" /> Business Description
            </h2>

            <textarea
              rows={3}
              placeholder="Brief overview of your manufacturing capabilities, fabric specialties, etc."
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Saving Changes...' : 'Save Profile Details'}
          </button>

        </form>

      </div>
    </div>
  );
}