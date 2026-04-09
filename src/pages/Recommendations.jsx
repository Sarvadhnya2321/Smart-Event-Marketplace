import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

export default function Recommendations() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      api.get(`/recommendations/${user.user_id}`)
        .then(res => setEvents(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <span className="text-purple-400">✨ AI Curated</span>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">Handpicked For You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
      
      {events.length === 0 && (
        <div className="bg-[#111] border border-white/5 p-12 rounded-3xl text-center relative z-10">
          <p className="text-gray-400 text-lg font-medium">No personalized recommendations yet. Explore our events to train the AI!</p>
        </div>
      )}
    </div>
  );
}