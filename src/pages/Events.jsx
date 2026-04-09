import { useState, useEffect } from 'react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get('/events/', { timeout: 10000 });

        // ✅ Extract + filter only public events
        const eventData = Array.isArray(res.data)
          ? res.data
          : (res.data?.events || []);

        setEvents([...eventData].reverse());

      } catch (err) {
        console.error("Explore page fetch error:", err);
        const errorMsg =
          err.response?.data?.detail ||
          err.message ||
          "Failed to connect to backend.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const refreshEvents = (deletedId) => {
    setEvents(prev => prev.filter(e => e.id !== deletedId));
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

  // ❌ ERROR
  if (error) return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="bg-red-500/10 border border-red-500/30 p-10 rounded-3xl">
        <h3 className="text-red-400 font-bold text-xl mb-3">
          Connection Error
        </h3>
        <p className="text-red-300 text-sm mb-6">{error}</p>

        <div className="text-left text-sm text-gray-400 bg-black/50 p-4 rounded-xl">
          <p className="font-semibold text-white mb-2">Troubleshooting:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Network Error</b> → CORS issue</li>
            <li><b>Timeout</b> → Cloud Run ↔ DB issue</li>
            <li>Check DevTools (F12 → Network)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ✅ UI
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">

      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Upcoming <span className="text-brand-500">Experiences</span>
        </h2>
        <p className="text-gray-400 mt-2 text-base">
          Discover and book premium events curated for you.
        </p>
      </div>

      {/* GRID */}
      {events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} refreshEvents={refreshEvents} />
          ))}
        </div>
      ) : (
        /* EMPTY */

        <div className="bg-[#0a0a0a] border border-white/10 p-16 rounded-3xl text-center max-w-2xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-2">
            No events available
          </h3>
          <p className="text-gray-500 text-sm">
            Public events will appear here once organizers publish them.
          </p>
        </div>
      )}

    </div>
  );
}