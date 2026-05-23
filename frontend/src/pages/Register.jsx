import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, Lock, User, Loader2 } from "lucide-react";
import { register as registerApi } from "../api/auth";
import { toastSuccess, toastError } from "../components/Toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.motDePasse !== form.confirmMotDePasse) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await registerApi(form.nom, form.email, form.motDePasse, "etudiant");
      toastSuccess("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'inscription.";
      setError(msg);
      toastError(msg);
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
          <p className="text-white/60 text-sm">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nom complet</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                placeholder="Votre nom"
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmMotDePasse"
                value={form.confirmMotDePasse}
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
            {loading ? "Inscription..." : "Créer le compte"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
