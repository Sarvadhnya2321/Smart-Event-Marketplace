import { useState, useEffect } from 'react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added an error state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Added a strict 10-second timeout. 
        // If Cloud Run hangs, React will forcefully cancel the request and show the error.
        const res = await api.get('/events/', { timeout: 10000 });
        
        // 2. Safely parse the incoming data
        const eventData = Array.isArray(res.data) ? res.data : (res.data?.events || []);
        setEvents(eventData);
        
      } catch (err) {
        console.error("Explore page fetch error:", err);
        // Extract the error message to display on the UI
        const errorMsg = err.response?.data?.detail || err.message || "Failed to connect to backend.";
        setError(errorMsg);
      } finally {
        // 3. This is guaranteed to run now, stopping the infinite buffer
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  // 1st State: Loading Spinner
  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
    </div>
  );

  // 2nd State: Error Screen (Instead of infinite buffering!)
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="bg-red-500/10 border border-red-500/30 p-10 rounded-3xl inline-block max-w-2xl">
        <h3 className="text-red-500 font-black text-2xl mb-3">Connection Error</h3>
        <p className="text-red-400 font-medium mb-6">{error}</p>
        <div className="text-left text-sm text-gray-400 bg-black/50 p-4 rounded-xl">
          <p className="font-bold text-white mb-2">How to fix this:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>If the error says <b>"Network Error"</b>: Your backend has a CORS policy issue blocking this URL.</li>
            <li>If the error says <b>"timeout of 10000ms exceeded"</b>: Your Cloud Run Python backend is unable to connect to your Cloud SQL database.</li>
            <li>Press <b>F12</b> and check the Network tab for more details.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 3rd State: Success / UI rendering
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-white tracking-tight">Upcoming Experiences</h2>
        <p className="text-gray-400 mt-2 font-medium">Discover and book the most exclusive events.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
      
      {events.length === 0 && (
        <div className="bg-[#111] border border-white/5 p-12 rounded-3xl text-center">
          <p className="text-gray-400 text-lg font-medium">No events found right now. Check back soon!</p>
        </div>
      )}
    </div>
  );
}