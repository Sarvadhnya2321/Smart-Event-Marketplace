import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State matches your reference fields exactly
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'Music', // Default category
    location: '',
    date: '',
    budget: '',
    ticketPrice: '', 
    file: null 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Create a native FormData object
    const payload = new FormData();
    
    // 2. Append all fields exactly as shown in your reference
    payload.append("organiser_id", 1); // Assuming 1 for now based on reference
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("location", formData.location);
    payload.append("date", formData.date);
    payload.append("budget", formData.budget);
    payload.append("ticket_price", formData.ticketPrice);
    
    // 3. Append the file using the exact key "poster"
    if (formData.file) {
      payload.append("poster", formData.file); 
    }

    try {
      // 4. Send the request with explicit multipart/form-data headers
      await api.post('/events/', payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert('Event published successfully!');
      navigate('/events');
    } catch (err) {
      console.error("Event creation error:", err);
      
      let errorMessage = "Failed to create event.";
      const detail = err.response?.data?.detail;
      
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

      alert(`Error Details:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-2xl p-10 relative z-10">
        <h2 className="text-4xl font-black text-white mb-2">Publish an Event</h2>
        <p className="text-gray-400 mb-10 font-medium">Bring your vision to life on EventSphere.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Title</label>
              <input type="text" required 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
                placeholder="e.g. Neon Nights Festival"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select required 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all cursor-pointer appearance-none" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Music">Music & Concerts</option>
                <option value="Tech">Tech & Innovation</option>
                <option value="Corporate">Corporate & Business</option>
                <option value="Arts">Arts & Culture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
              <input type="date" required 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
              <input type="text" required 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
                placeholder="e.g. Central Park"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea required rows="4" 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600 resize-none" 
              placeholder="Tell the attendees what makes this event special..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Budget ($)</label>
              <input type="number" required min="0" 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
                placeholder="e.g. 5000"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket Price ($)</label>
              <input type="number" required min="0" 
                className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600" 
                placeholder="0.00"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Poster</label>
            <div className="block w-full bg-[#0a0a0a] border border-white/10 border-dashed text-gray-400 px-5 py-8 rounded-xl text-center hover:border-brand-500/50 transition-colors">
              <input type="file" accept="image/*" required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 file:cursor-pointer cursor-pointer transition-all" 
                onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
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