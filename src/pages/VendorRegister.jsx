import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function VendorRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State matches your models.py VendorCreate exact keys
  const [formData, setFormData] = useState({
    user_id: '',
    business_name: '',
    category: 'Catering', 
    description: '',
    price_range: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send as standard JSON because vendors.py uses a Pydantic BaseModel directly
      const payload = {
        user_id: parseInt(formData.user_id),
        business_name: formData.business_name,
        category: formData.category,
        description: formData.description,
        price_range: formData.price_range
      };

      // Explicitly forcing the header so FastAPI reads the body as JSON
      await api.post('/vendors/register', payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Business Registered Successfully!");
      navigate('/vendors'); 
      
    } catch (err) {
      console.error("Submission Error:", err);
      const detail = err.response?.data?.detail;
      let errorMessage = "Failed to register vendor business.";
      
      if (Array.isArray(detail)) {
        errorMessage = detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join('\n');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      }
      alert(`Registration Error:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 bg-black py-12">
      <div className="max-w-md w-full bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-2">Vendor Signup</h2>
        <p className="text-gray-400 mb-8 text-sm">Register your professional services.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">User ID</label>
            <input 
              required type="number"
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500"
              placeholder="e.g. 1"
              value={formData.user_id}
              onChange={(e) => setFormData({...formData, user_id: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Business Name</label>
            <input 
              required type="text"
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500"
              placeholder="e.g. Elite Sound Systems"
              value={formData.business_name}
              onChange={(e) => setFormData({...formData, business_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Service Category</label>
            <select 
              required
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500 cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Catering">Catering</option>
              <option value="Sound">Sound Systems</option>
              <option value="Lighting">Lighting & Decor</option>
              <option value="Venue">Venue Provider</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
            <textarea 
              required rows="3"
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500 resize-none"
              placeholder="Tell us about your services..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Price Range</label>
            <select 
              required
              className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500 cursor-pointer"
              value={formData.price_range}
              onChange={(e) => setFormData({...formData, price_range: e.target.value})}
            >
              <option value="" disabled>Select a range</option>
              <option value="$">$ (Budget)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Premium)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Business"}
          </button>
        </form>
      </div>
    </div>
  );
}