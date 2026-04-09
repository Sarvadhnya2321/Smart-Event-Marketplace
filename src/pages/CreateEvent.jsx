import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State matches your events.py backend parameters exactly
  const [formData, setFormData] = useState({ 
    organiser_id: '',
    title: '', 
    description: '', 
    category: 'Music', 
    location: '',
    date: '',
    budget: '',
    ticket_price: '', 
    file: null 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create a native FormData object (Required for Form(...) + File(...) in FastAPI)
    const payload = new FormData();
    payload.append("organiser_id", parseInt(formData.organiser_id));
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("location", formData.location);
    payload.append("date", formData.date);
    payload.append("budget", parseFloat(formData.budget));
    payload.append("ticket_price", parseFloat(formData.ticket_price));
    
    if (formData.file) {
      payload.append("poster", formData.file); 
    }

    try {
      // Explicitly forcing the header to prevent default JSON overrides
      await api.post('/events/', payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert('Event published successfully!');
      navigate('/events');
    } catch (err) {
      console.error("Event creation error:", err);
      const detail = err.response?.data?.detail;
      let errorMessage = "Failed to create event.";
      
      if (Array.isArray(detail)) {
        errorMessage = detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join('\n');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      }
      alert(`Error Details:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-2xl p-10 relative z-10">
        <h2 className="text-4xl font-black text-white mb-2">Publish an Event</h2>
        <p className="text-gray-400 mb-10 font-medium">Bring your vision to life on EventSphere.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organiser ID</label>
              <input type="number" required 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
                placeholder="e.g. 1"
                value={formData.organiser_id}
                onChange={(e) => setFormData({...formData, organiser_id: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Title</label>
              <input type="text" required 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
                placeholder="e.g. Neon Nights"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select required 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none cursor-pointer" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Music">Music & Concerts</option>
                <option value="Tech">Tech & Innovation</option>
                <option value="Corporate">Corporate & Business</option>
                <option value="Arts">Arts & Culture</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
              <input type="text" required 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
                placeholder="e.g. Central Park"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
              <input type="date" required 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Budget ($)</label>
              <input type="number" required min="0" 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
                placeholder="5000"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea required rows="3" 
              className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none resize-none" 
              placeholder="Event details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket Price ($)</label>
            <input type="number" required min="0" 
              className="w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:border-brand-500 outline-none" 
              placeholder="0.00"
              value={formData.ticket_price}
              onChange={(e) => setFormData({...formData, ticket_price: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Poster</label>
            <div className="w-full bg-[#0a0a0a] border border-white/10 border-dashed text-gray-400 px-5 py-6 rounded-xl text-center hover:border-brand-500/50">
              <input type="file" accept="image/*" required
                className="w-full text-sm file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:bg-white file:text-black cursor-pointer" 
                onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} 
            className="w-full py-4 px-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 mt-4">
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}