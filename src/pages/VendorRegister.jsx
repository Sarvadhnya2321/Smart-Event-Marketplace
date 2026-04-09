import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function VendorRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '', // Must match your Python/Swagger field exactly
    category: 'Catering'
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setLoading(true);
    
    try {
      // POSTING to /vendors/register as seen in your Swagger UI
      const response = await api.post('/vendors/register', {
        business_name: formData.business_name,
        category: formData.category,
        rating: 5.0 // Sending a default rating as backends often require this
      });

      console.log("Success:", response.data);
      alert("Business Registered Successfully!");
      navigate('/vendors'); // Move to the directory after success
      
    } catch (err) {
      console.error("Submission Error:", err);
      
      // Safely handle FastAPI's error formats (especially 422 Validation Errors)
      let errorMessage = "Failed to register vendor business.";
      const detail = err.response?.data?.detail;
      
      if (detail) {
        if (Array.isArray(detail)) {
          // FastAPI returns an array of objects for missing/invalid fields
          errorMessage = detail.map(errItem => {
            // Extracts the field name and the error message
            const field = errItem.loc ? errItem.loc[errItem.loc.length - 1] : 'Field';
            return `${field}: ${errItem.msg}`;
          }).join('\n');
        } else if (typeof detail === 'string') {
          // Standard string error from your custom Python logic
          errorMessage = detail;
        } else {
          // Fallback just in case it's another type of object
          errorMessage = JSON.stringify(detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(`Registration Error:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 bg-black">
      <div className="max-w-md w-full bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-2">Vendor Signup</h2>
        <p className="text-gray-400 mb-8 text-sm">Register your professional services.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Business Name</label>
            <input 
              required
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500 transition-all placeholder:text-gray-700"
              placeholder="e.g. Elite Sound Systems"
              value={formData.business_name}
              onChange={(e) => setFormData({...formData, business_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Service Category</label>
            <select 
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none cursor-pointer appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Catering">Catering</option>
              <option value="Sound">Sound Systems</option>
              <option value="Lighting">Lighting & Decor</option>
              <option value="Venue">Venue Provider</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 py-4 rounded-xl text-white font-bold text-lg transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {loading ? "Registering..." : "Register Business"}
          </button>
        </form>
      </div>
    </div>
  );
}