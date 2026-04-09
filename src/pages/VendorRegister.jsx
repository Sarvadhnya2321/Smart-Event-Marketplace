import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function VendorRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    business_name: '',
    category: 'Catering',
    description: '',
    price_range: '',
    contact_info: '',
  });

  const categories = [
    "Catering",
    "Sound Systems",
    "Lighting & Decor",
    "Venue Provider"
  ];

  const prices = [
    { label: "$", value: "$" },
    { label: "$$", value: "$$" },
    { label: "$$$", value: "$$$" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/vendors/register', {
        ...formData,
        user_id: parseInt(formData.user_id),
      });

      alert("Business Registered Successfully!");
      navigate('/vendors');

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-brand-500 transition";

  return (
    <div className="flex justify-center items-start min-h-screen bg-black px-6 py-10">
      
      {/* 🔥 WIDER + SHORTER CARD */}
      <div className="w-full max-w-5xl bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white">
            Vendor <span className="text-brand-500">Signup</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Register your business in EventSphere
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <input
              type="number"
              placeholder="User ID"
              className={inputClass}
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              required
            />

            {/* CATEGORY */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenCategory(!openCategory)}
                className={inputClass + " text-left"}
              >
                {formData.category}
              </button>

              {openCategory && (
                <div className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl z-10">
                  {categories.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setFormData({ ...formData, category: item });
                        setOpenCategory(false);
                      }}
                      className="p-2 hover:bg-brand-500/20 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenPrice(!openPrice)}
                className={inputClass + " text-left"}
              >
                {formData.price_range || "Price"}
              </button>

              {openPrice && (
                <div className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl z-10">
                  {prices.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setFormData({ ...formData, price_range: item.value });
                        setOpenPrice(false);
                      }}
                      className="p-2 hover:bg-brand-500/20 cursor-pointer"
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Business Name"
              className={inputClass}
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Contact Info"
              className={inputClass}
              value={formData.contact_info}
              onChange={(e) =>
                setFormData({ ...formData, contact_info: e.target.value })
              }
              required
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows="2"
            placeholder="Short description..."
            className={`${inputClass} resize-none`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 px-8 py-3 rounded-xl text-white font-bold transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}