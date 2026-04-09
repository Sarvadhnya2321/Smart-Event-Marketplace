import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import VendorCard from '../components/VendorCard';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vendors')
      .then(res => {
        setVendors(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Error fetching vendors:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ REFRESH AFTER DELETE
  const refreshVendors = (deletedId) => {
    setVendors(prev => prev.filter(v => v.id !== deletedId));
  };

  // 🔄 LOADING
  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh] bg-black">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Elite <span className="text-brand-500">Vendors</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base leading-relaxed">
            Discover top-tier service providers for your events — from catering to immersive setups.
          </p>
        </div>

        {/* ACTION */}
        <button 
          onClick={() => navigate('/vendor-register')}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition"
        >
          <span>List your business</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* GRID */}
      {vendors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vendors.map(vendor => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              refreshVendors={refreshVendors} // ✅ PASS HERE
            />
          ))}
        </div>
      ) : (
        
        /* EMPTY STATE */
        <div className="bg-[#0a0a0a] border border-white/10 p-16 rounded-3xl text-center max-w-2xl mx-auto">
          
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>

          <h3 className="text-white text-xl font-bold">No vendors yet</h3>

          <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
            Be the first to register your business and start receiving event opportunities.
          </p>

          <button 
            onClick={() => navigate('/vendor-register')}
            className="mt-6 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-semibold transition"
          >
            Register Now
          </button>

        </div>
      )}
    </div>
  );
}