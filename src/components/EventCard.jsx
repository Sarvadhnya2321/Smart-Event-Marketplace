import { useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function EventCard({ event, refreshEvents }) {
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isOrganizer = user?.role === "organiser";
  const isOwner = user && user.user_id === event.organiser_id;

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });

  const handleBook = async () => {
    if (!user) return alert('Login required');

    setBooking(true);
    try {
      await api.post(
        `/bookings/?user_id=${user.user_id}&event_id=${event.id}&tickets=1`
      );
      setMessage('Booked!');
    } catch {
      setMessage('Failed');
    } finally {
      setBooking(false);
    }
  };

  const handlePublish = async () => {
    try {
      await api.post(`/events/${event.id}/publish`);
      refreshEvents();
    } catch {
      alert("Publish failed");
    }
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/events/${event.id}`);
      refreshEvents(event.id);
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">

      {/* IMAGE */}
      <div className="relative h-40">
        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition"
        />

        {/* CATEGORY */}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 text-[10px] rounded-full text-white">
          {event.category}
        </div>

        {/* DRAFT BADGE */}
        {!event.is_published && isOrganizer && (
          <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 text-[10px] rounded-full">
            Draft
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-1.5">

        <h3 className="text-white font-semibold text-sm line-clamp-1">
          {event.title}
        </h3>

        <p className="text-gray-400 text-xs">
          📍 {event.location} • {formattedDate}
        </p>

        <p className="text-gray-500 text-xs">
          Budget: ₹{event.budget}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-2">

          <span className="text-white text-sm font-bold">
            ₹{event.ticket_price}
          </span>

          <div className="flex gap-1">

            {/* BOOK */}
            {event.is_published && (
              <button
                onClick={handleBook}
                className="bg-brand-500 px-2.5 py-1 rounded-md text-[11px] text-white"
              >
                {booking ? "..." : message || "Book"}
              </button>
            )}

            {/* PUBLISH */}
            {isOrganizer && isOwner && !event.is_published && (
              <button
                onClick={handlePublish}
                className="bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-md text-[11px]"
              >
                Publish
              </button>
            )}

            {/* 🔥 DELETE */}
            {isOrganizer && isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md text-[11px] hover:bg-red-500/30"
              >
                {deleting ? "..." : "Delete"}
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}