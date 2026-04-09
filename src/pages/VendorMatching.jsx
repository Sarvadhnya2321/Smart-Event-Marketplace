import { useState } from 'react';
import { api } from '../services/api';
import VendorCard from '../components/VendorCard';

export default function VendorMatching() {
  const [eventId, setEventId] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get(`/vendor-matching/${eventId}`);
      setVendors(data);
    } catch (err) {
      alert('Error fetching matches. Please check the Event ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-[#111111] rounded-3xl shadow-2xl p-10 mb-12 border border-white/10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 relative z-10">AI Vendor Matching</h2>
        <p className="text-gray-400 mb-8 font-medium relative z-10">Find the perfect vendors tailored to your event requirements.</p>
        
        <form onSubmit={handleMatch} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <input type="text" placeholder="Enter Event ID" required 
            className="flex-1 px-5 py-4 bg-[#0a0a0a] border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
            onChange={(e) => setEventId(e.target.value)} />
          <button type="submit" disabled={loading} 
            className="px-8 py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-[0_0_15px_var(--color-brand-glow)] disabled:opacity-50 whitespace-nowrap">
            {loading ? 'Analyzing...' : 'Find Matches ✨'}
          </button>
        </form>
      </div>

      {vendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)}
        </div>
      )}
    </div>
  );
}