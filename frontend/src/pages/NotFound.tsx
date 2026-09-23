import { useNavigate } from 'react-router';
import { Zap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center text-center px-6">
      <div>
        <div className="text-7xl font-extrabold font-[Plus_Jakarta_Sans] gradient-teal mb-4">404</div>
        <div className="text-white font-bold text-xl mb-2">Page Not Found</div>
        <div className="text-[#64748b] text-sm mb-8">Looks like this page doesn't exist yet.</div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
      </div>
    </div>
  );
}
