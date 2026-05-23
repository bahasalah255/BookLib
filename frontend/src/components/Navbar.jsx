import { BookOpen, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <BookOpen size={24} className="text-gold" />
        <span className="text-gold font-bold text-xl tracking-wide">BookLib</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors"
        >
          <User size={18} />
          <span className="hidden sm:inline">{user?.nom}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-white/80 hover:text-gold transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
