import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import VendorCard from '../components/VendorCard';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetches the list of vendors from your live Cloud Run API
    api.get('/vendors')
      .then(res => {
        // We ensure we are setting an array even if the DB is empty
        setVendors(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Error fetching vendors:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
            Elite <span className="text-brand-500">Vendors</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg font-medium leading-relaxed">
            Connect with premium service providers vetted for the EventSphere ecosystem. 
            From world-class catering to immersive lighting.
          </p>
        </div>
        
        {/* Subtle Action Button */}
        <button 
          onClick={() => navigate('/vendor-register')}
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <span>List your business</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
      
      {/* Vendors Grid */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#0a0a0a] border border-white/5 p-20 rounded-[40px] text-center">
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
          </div>
          <h3 className="text-white text-2xl font-bold">No active vendors</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Our directory is currently empty. Be the first vendor to join and start accepting event applications!
          </p>
          <button 
            onClick={() => navigate('/vendor-register')}
            className="mt-8 bg-brand-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Register Now
          </button>
        </div>
      )}
    </div>
  );
}