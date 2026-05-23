import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, Lock, Loader2 } from "lucide-react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", motDePasse: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginApi(form.email, form.motDePasse);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
        <div className="bg-primary px-8 py-8 flex flex-col items-center gap-3">
          <div className="bg-gold/20 p-3 rounded-full">
            <BookOpen size={36} className="text-gold" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">BookLib</h1>
          <p className="text-white/60 text-sm">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
