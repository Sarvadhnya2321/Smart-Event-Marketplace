import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function EventCard({ event }) {
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');

  const handleBook = async () => {
    if (!user) return alert('Please login to book tickets.');
    setBooking(true);
    try {
      await api.post(`/bookings/?user_id=${user.user_id}&event_id=${event.id}&tickets=1`);
      setMessage('Tickets Booked!');
    } catch (err) {
      setMessage('Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="group relative bg-[#0a0a0a] rounded-3xl transition-all duration-500 overflow-hidden border border-white/5 hover:border-white/20 flex flex-col cursor-pointer shadow-lg hover:shadow-2xl">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
        <img 
          src={event.poster_url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop'} 
          alt={event.name} 
          className="object-cover w-full h-full group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
          Selling Fast
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col relative z-10 -mt-12">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-white leading-tight line-clamp-1 drop-shadow-md">{event.name}</h3>
          <span className="flex items-center gap-1 text-sm font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
            ★ 4.9
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1 mt-2">{event.description}</p>
        
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</span>
            <div className="text-2xl font-black text-white">${event.price}</div>
          </div>
          <button 
            onClick={handleBook} 
            disabled={booking || message}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              message 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white text-black hover:bg-gray-200 disabled:opacity-50'
            }`}
          >
            {booking ? 'Processing...' : message || 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}