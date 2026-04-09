import { useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function VendorCard({ vendor, refreshVendors }) {
  const { user } = useContext(AuthContext);

  const [deleting, setDeleting] = useState(false);

  // ✅ Role check
  const isOrganizer = user?.role === "organiser";

  // ✅ DELETE FUNCTION
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this vendor?");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/vendors/${vendor.id}`);

      // ✅ Update UI instantly if parent function exists
      if (refreshVendors) {
        refreshVendors(vendor.id);
      }

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300 group">
      
      {/* TOP */}
      <div className="flex items-start justify-between mb-5">
        
        {/* ICON */}
        <div className="h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-xl group-hover:scale-110 transition-transform">
          {vendor.business_name?.charAt(0)}
        </div>

        {/* RATING */}
        <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          ★ {vendor.rating || '4.5'}
        </span>
      </div>

      {/* NAME */}
      <h3 className="text-xl font-bold text-white mb-1">
        {vendor.business_name}
      </h3>

      {/* CATEGORY */}
      <p className="text-brand-500 text-sm font-semibold mb-3">
        {vendor.category}
      </p>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4">
        {vendor.description}
      </p>

      {/* CONTACT + ACTIONS */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        
        <p className="text-gray-400 text-xs truncate">
          {vendor.contact_info}
        </p>

        <div className="flex gap-2">
          
          {/* CONTACT BUTTON */}
          <button className="text-xs bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 px-3 py-1 rounded-lg transition">
            Contact
          </button>

          {/* DELETE BUTTON (ONLY ORGANIZER) */}
          {isOrganizer && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg transition"
            >
              {deleting ? "..." : "Delete"}
            </button>
          )}

        </div>
      </div>

    </div>
  );
}