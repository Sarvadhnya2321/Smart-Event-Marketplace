import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // VENDOR REDIRECT: Vendors need different fields than standard users
    if (formData.role === 'vendor') {
      navigate('/vendor-register');
      return;
    }

    const res = await register(formData);
    if (res.success) navigate('/login');
    else setError(res.message);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[#050505]">
      <div className="max-w-md w-full bg-[#111]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl">
        <h2 className="text-3xl font-black text-white text-center mb-8 tracking-tight">Join EventSphere</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" required placeholder="Full Name" className="w-full bg-black border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <input type="email" required placeholder="Email" className="w-full bg-black border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" required placeholder="Password" className="w-full bg-black border border-white/10 text-white p-4 rounded-xl outline-none focus:border-brand-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <select className="w-full bg-black border border-white/10 text-white p-4 rounded-xl outline-none appearance-none cursor-pointer"
            onChange={(e) => setFormData({...formData, role: e.target.value})} value={formData.role}>
            <option value="user">Attendee</option>
            <option value="organiser">Organiser</option>
            <option value="vendor">Vendor Business</option>
          </select>

          <button type="submit" disabled={loading} className="w-full bg-brand-500 py-4 rounded-xl text-white font-bold hover:bg-brand-600 transition shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}