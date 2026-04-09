import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-[#111111] rounded-3xl border border-white/10 p-10 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px]"></div>

        <div className="flex items-center space-x-6 mb-12 relative z-10">
          <div className="h-20 w-20 bg-gradient-to-br from-brand-500 to-rose-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-[0_0_20px_var(--color-brand-glow)] border border-white/10">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Hello, {user.name}</h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {user.role} Account
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {user.role === 'user' && (
            <Link to="/recommendations" className="group p-8 bg-[#0a0a0a] rounded-2xl hover:bg-[#151515] transition-all border border-white/5 hover:border-brand-500/30">
              <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center mb-6 border border-brand-500/20 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">For You</h3>
              <p className="text-gray-400 text-sm">Discover AI-curated events matching your unique tastes.</p>
            </Link>
          )}

          {user.role === 'organiser' && (
            <>
              <Link to="/create-event" className="group p-8 bg-[#0a0a0a] rounded-2xl hover:bg-[#151515] transition-all border border-white/5 hover:border-brand-500/30">
                <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center mb-6 border border-brand-500/20 group-hover:scale-110 transition-transform">➕</div>
                <h3 className="text-xl font-bold text-white mb-2">Create Event</h3>
                <p className="text-gray-400 text-sm">Draft and publish a new premium experience.</p>
              </Link>
              <Link to="/vendor-matching" className="group p-8 bg-[#0a0a0a] rounded-2xl hover:bg-[#151515] transition-all border border-white/5 hover:border-brand-500/30">
                <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center mb-6 border border-brand-500/20 group-hover:scale-110 transition-transform">🤝</div>
                <h3 className="text-xl font-bold text-white mb-2">Find Vendors</h3>
                <p className="text-gray-400 text-sm">Match with elite service providers for your events.</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}