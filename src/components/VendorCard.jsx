export default function VendorCard({ vendor }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xl mb-2 group-hover:scale-110 transition-transform">
          {vendor.business_name.charAt(0)}
        </div>
        <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          ★ {vendor.rating || '4.5'}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.business_name}</h3>
      <p className="text-brand-600 text-sm font-semibold mb-3">{vendor.service_type}</p>
      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{vendor.description}</p>
    </div>
  );
}