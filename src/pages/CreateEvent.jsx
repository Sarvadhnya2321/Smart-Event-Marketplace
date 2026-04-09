import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Package the data for FastAPI
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    try {
      await api.post('/events/', data, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // If successful, redirect to the explore/events page
      navigate('/events');
    } catch (err) {
      console.error("Event creation error:", err);
      
      let errorMessage = "Failed to create event.";
      const detail = err.response?.data?.detail;
      
      // Improved error handler to parse FastAPI's 422 array format
      if (detail) {
        if (Array.isArray(detail)) {
          errorMessage = detail.map(errItem => {
            const field = errItem.loc ? errItem.loc[errItem.loc.length - 1] : 'Field';
            return `${field}: ${errItem.msg}`;
          }).join('\n');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else {
          errorMessage = JSON.stringify(detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Alert the exact missing fields required by your backend
      alert(`Error Details:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 relative">
      {/* Glow Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-2xl p-10 relative z-10">
        <h2 className="text-4xl font-black text-white mb-2">Publish an Event</h2>
        <p className="text-gray-400 mb-10 font-medium">Bring your vision to life on EventSphere.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Name</label>
            <input type="text" required 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
              placeholder="e.g. Neon Nights Festival"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea required rows="4" 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600 resize-none" 
              placeholder="Tell the attendees what makes this event special..."
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket Price ($)</label>
            <input type="number" required min="0" 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
              placeholder="0.00"
              onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Poster</label>
            <div className="block w-full bg-[#0a0a0a] border border-white/10 border-dashed text-gray-400 px-5 py-8 rounded-xl text-center hover:border-brand-500/50 transition-colors">
              <input type="file" accept="image/*" 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 file:cursor-pointer cursor-pointer transition-all" 
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} 
            className="w-full py-4 px-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-[0_0_15px_var(--color-brand-glow)] hover:shadow-[0_0_25px_var(--color-brand-glow)] disabled:opacity-50 mt-4">
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}