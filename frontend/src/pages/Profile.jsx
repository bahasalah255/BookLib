import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { toastSuccess, toastError } from "../components/Toast";

export default function Profile() {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: user?.nom || "",
    email: user?.email || "",
    motDePasse: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { nom: form.nom, email: form.email };
    if (form.motDePasse) payload.motDePasse = form.motDePasse;

    try {
      const { data } = await updateProfile(payload, token);
      login(data.token || token, { ...user, nom: form.nom, email: form.email });
      toastSuccess("Profil mis à jour !");
      setForm((p) => ({ ...p, motDePasse: "" }));
    } catch (err) {
      toastError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.nom
    ? user.nom.charAt(0).toUpperCase()
    : "?";

  const roleLabel = user?.role === "admin" ? "Administrateur" : "Étudiant";
  const roleBg = user?.role === "admin"
    ? "bg-gold text-primary"
    : "bg-blue-100 text-blue-700";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au tableau de bord
        </button>

        {/* Avatar card */}
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-gold text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user?.nom}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${roleBg}`}>
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-base font-semibold text-primary mb-4">
            Modifier le profil
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nouveau mot de passe{" "}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                placeholder="Laisser vide pour ne pas changer"
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sauvegarde..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
