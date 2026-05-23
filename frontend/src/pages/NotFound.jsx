import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-6 text-center px-4">
      <BookOpen size={64} className="text-primary/20" />
      <div>
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="text-gray-500 mt-2 text-lg">Page introuvable</p>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        Retour au tableau de bord
      </button>
    </div>
  );
}
