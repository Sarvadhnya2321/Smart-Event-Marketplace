import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="bg-gray-950/95 backdrop-blur-lg border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <span className="bg-brand-500 text-white h-8 w-8 flex items-center justify-center rounded-lg shadow-lg shadow-brand-500/30">E</span>
              EventSphere
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link to="/events" className={`px-4 py-2 rounded-full text-sm font-medium transition ${location.pathname === '/events' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Explore</Link>
              <Link to="/vendors" className={`px-4 py-2 rounded-full text-sm font-medium transition ${location.pathname === '/vendors' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Vendors</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white px-3">Dashboard</Link>
                {user.role === 'organiser' && (
                  <Link to="/create-event" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-medium transition">Create</Link>
                )}
                <div className="h-6 w-px bg-gray-700 mx-2"></div>
                <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-brand-500 transition">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-4">Log in</Link>
                <Link to="/register" className="text-sm font-bold bg-brand-500 hover:bg-brand-600 px-6 py-2.5 rounded-full transition shadow-lg shadow-brand-500/20">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}