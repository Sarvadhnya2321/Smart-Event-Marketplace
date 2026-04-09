import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// A mock list of popular cities for the autocomplete. 
// In production, you would replace this with the Google Places API or Mapbox API.
const POPULAR_CITIES = [
  "Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", 
  "New York", "London", "Dubai", "Singapore", "Tokyo"
];

export default function Home() {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('');
  
  // Location States
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Date State
  const [selectedDate, setSelectedDate] = useState('');
  
  // Ref to close dropdown when clicking outside
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Location Typing & Autocomplete
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 0) {
      const filtered = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (city) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  // The +/- 4 Days Logic & Submission
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (eventType) params.append('type', eventType);
    if (location) params.append('location', location);
    
    // Calculate the +/- 4 days window
    if (selectedDate) {
      const baseDate = new Date(selectedDate);
      
      const minDate = new Date(baseDate);
      minDate.setDate(baseDate.getDate() - 4);
      
      const maxDate = new Date(baseDate);
      maxDate.setDate(baseDate.getDate() + 4);

      // Format as YYYY-MM-DD for the backend
      params.append('start_date', minDate.toISOString().split('T')[0]);
      params.append('end_date', maxDate.toISOString().split('T')[0]);
    }
    
    navigate(`/events?${params.toString()}`);
  };

  // GPS Auto-Detect
  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          setLocation(data.address.city || data.address.town || data.address.state_district || "Detected Location");
          setShowSuggestions(false);
        } catch (error) {
          alert("Could not determine your city.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Please allow location access.");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/80 to-[#050505]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 pt-10">
        <span className="inline-block py-1.5 px-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 font-bold text-xs tracking-widest uppercase mb-8 shadow-[0_0_15px_var(--color-brand-glow)]">
          Welcome to EventSphere
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
          Experience the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-rose-400">Extraordinary.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
          Premium access to global concerts, exclusive dining, and elite workshops.
        </p>

        {/* 3-PART FUNCTIONAL SEARCH BAR */}
        <form 
          onSubmit={handleSearch} 
          className="bg-[#111111]/90 backdrop-blur-2xl p-2 rounded-full shadow-2xl mx-auto flex flex-col md:flex-row items-center gap-2 border border-white/10 w-full max-w-4xl"
        >
          {/* 1. Event Type Input */}
          <div className="flex-1 px-6 py-2 text-left w-full hover:bg-white/5 rounded-full transition flex flex-col justify-center focus-within:bg-white/5 h-14">
            <label htmlFor="eventType" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide cursor-pointer">
              Event Type
            </label>
            <input 
              id="eventType" type="text" value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="Concerts, Sports..." 
              className="bg-transparent border-none text-sm text-gray-200 font-medium outline-none placeholder-gray-600 w-full p-0"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-white/10"></div>
          
          {/* 2. Location Input with Autocomplete */}
          <div ref={locationRef} className="flex-1 px-6 py-2 text-left w-full hover:bg-white/5 rounded-full transition flex flex-col justify-center focus-within:bg-white/5 relative h-14">
            <label htmlFor="location" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide cursor-pointer">
              Location
            </label>
            <div className="flex items-center w-full">
              <input 
                id="location" type="text" value={location}
                onChange={handleLocationChange}
                onFocus={() => location.length > 0 && setShowSuggestions(true)}
                placeholder="Search city" 
                className="bg-transparent border-none text-sm text-gray-200 font-medium outline-none placeholder-gray-600 w-full pr-8 p-0"
              />
              <button type="button" onClick={detectLocation} className="absolute right-4 text-gray-500 hover:text-brand-500 transition-colors">
                {isLocating ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19 12c0-3.87-3.13-7-7-7s-7 3.13-7 7"></path><path d="M22 12h-3"></path><path d="M5 12H2"></path><path d="M12 5V2"></path><path d="M12 22v-3"></path></svg>
                )}
              </button>
            </div>

            {/* Floating Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 mt-3 w-full bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-2">
                {suggestions.map((city, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => selectSuggestion(city)}
                    className="px-6 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <span className="text-gray-500">📍</span> {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-white/10"></div>

          {/* 3. Flexible Date Picker */}
          <div className="flex-1 px-6 py-2 text-left w-full hover:bg-white/5 rounded-full transition flex flex-col justify-center focus-within:bg-white/5 h-14">
            <label htmlFor="date" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide cursor-pointer flex justify-between">
              <span>Date</span>
              <span className="text-brand-500 lowercase tracking-normal">±4 days</span>
            </label>
            <input 
              id="date" type="date" value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-200 font-medium outline-none w-full p-0 cursor-pointer [color-scheme:dark]"
            />
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto h-14 bg-brand-500 hover:bg-brand-600 text-white font-bold px-10 rounded-full transition-all flex items-center justify-center shadow-[0_0_20px_var(--color-brand-glow)] hover:shadow-[0_0_30px_var(--color-brand-glow)] ml-1"
          >
            Explore
          </button>
        </form>
      </div>
    </div>
  );
}