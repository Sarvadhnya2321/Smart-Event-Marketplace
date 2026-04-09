import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    organiser_id: '',
    title: '',
    description: '',
    category: 'Music',
    location: '',
    date: '',
    budget: '',
    ticket_price: '',
  is_published: true,  
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("organiser_id", parseInt(formData.organiser_id));
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("location", formData.location);
    payload.append("date", formData.date);
    payload.append("budget", parseFloat(formData.budget));
    payload.append("ticket_price", parseFloat(formData.ticket_price));
    payload.append("is_published", formData.is_published); // ✅ NEW

    if (formData.file) {
      payload.append("poster", formData.file);
    }

    try {
      await api.post('/events/', payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert('Event created successfully!');
      navigate('/events');

    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl focus:border-brand-500 outline-none transition";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">
              Create <span className="text-brand-500">Event</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Fill details and publish instantly
            </p>
          </div>

          {/* 🔥 TOGGLE SWITCH */}
          {/* <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  is_published: !formData.is_published
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                formData.is_published ? 'bg-brand-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition ${
                  formData.is_published ? 'translate-x-6' : ''
                }`}
              />
            </button>

            <span className="text-xs text-white font-semibold">
              {formData.is_published ? 'Published' : 'Not Published'}
            </span>
          </div> */}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Organiser ID"
              className={inputClass}
              value={formData.organiser_id}
              onChange={(e) => setFormData({...formData, organiser_id: e.target.value})}
              required
            />

            <input
              type="text"
              placeholder="Event Title"
              className={inputClass}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />

            <select
              className={inputClass}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Music">Music</option>
              <option value="Tech">Tech</option>
              <option value="Corporate">Corporate</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location"
              className={inputClass}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />

            <input
              type="date"
              className={inputClass}
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />

            <input
              type="number"
              placeholder="Budget"
              className={inputClass}
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows="2"
            placeholder="Short description..."
            className={`${inputClass} resize-none`}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Ticket Price"
              className={inputClass}
              value={formData.ticket_price}
              onChange={(e) => setFormData({...formData, ticket_price: e.target.value})}
              required
            />

            {/* FILE */}
            <input
              type="file"
              accept="image/*"
              className={inputClass}
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
              required
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 px-8 py-3 rounded-xl text-white font-bold transition"
            >
              {loading ? 'Publishing...' : 'Create Event'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}