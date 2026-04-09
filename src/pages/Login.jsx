import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(formData.email, formData.password);
    if (!res.success) setError(res.message);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#111111]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-brand-500 rounded-xl mx-auto flex items-center justify-center shadow-[0_0_20px_var(--color-brand-glow)] mb-6">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access EventSphere</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" required 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-600 outline-none"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" required 
              className="block w-full bg-[#0a0a0a] border border-white/10 text-white px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-600 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} 
            className="w-full flex justify-center py-4 px-4 mt-8 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-[0_0_15px_var(--color-brand-glow)] hover:shadow-[0_0_25px_var(--color-brand-glow)] disabled:opacity-50 disabled:shadow-none">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}