import { useState, useEffect, useCallback } from "react";
import { BookOpen, Bookmark, Crown, Plus, Search, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import Stats from '../components/Stats.jsx';
import BookTable from "../components/BookTable";
import BorrowTable from "../components/BorrowTable";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { getAllBooks, addBook, updateBook, deleteBook } from "../api/books";
import { getMyBorrows, getAllBorrows, borrowBook, returnBook } from "../api/borrows";
import { toastSuccess, toastError } from "../components/Toast";

const SECTIONS = {
  CATALOGUE: "catalogue",
  EMPRUNTS: "emprunts",
  ADMIN: "admin",
};

const emptyBook = { titre: "", auteur: "", isbn: "", disponible: true };

export default function Dashboard() {
  const { token, isAdmin } = useAuth();

  const [section, setSection] = useState(SECTIONS.CATALOGUE);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [saving, setSaving] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllBooks(token);
      setBooks(data);
    } catch {
      toastError("Impossible de charger les livres.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = isAdmin()
        ? await getAllBorrows(token)
        : await getMyBorrows(token);
      setBorrows(data);
    } catch {
      toastError("Impossible de charger les emprunts.");
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (section === SECTIONS.EMPRUNTS) fetchBorrows();
  }, [section, fetchBorrows]);

  const filteredBooks = books.filter(
    (b) =>
      b.titre.toLowerCase().includes(search.toLowerCase()) ||
      b.auteur.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingBook(null);
    setBookForm(emptyBook);
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setBookForm({
      titre: book.titre,
      auteur: book.auteur,
      isbn: book.isbn,
      disponible: book.disponible,
    });
    setModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBook) {
        await updateBook(editingBook._id, bookForm, token);
        toastSuccess("Livre mis à jour.");
      } else {
        await addBook(bookForm, token);
        toastSuccess("Livre ajouté.");
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err) {
      toastError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce livre ?")) return;
    try {
      await deleteBook(id, token);
      toastSuccess("Livre supprimé.");
      fetchBooks();
    } catch {
      toastError("Impossible de supprimer ce livre.");
    }
  };

  const handleBorrow = async (livreId) => {
    try {
      await borrowBook(livreId, token);
      toastSuccess("Emprunt enregistré !");
      fetchBooks();
    } catch (err) {
      toastError(err.response?.data?.message || "Impossible d'emprunter ce livre.");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id, token);
      toastSuccess("Retour enregistré !");
      fetchBorrows();
      fetchBooks();
    } catch {
      toastError("Impossible d'enregistrer le retour.");
    }
  };

  const navItems = [
    { key: SECTIONS.CATALOGUE, label: "Catalogue" },
    { key: SECTIONS.EMPRUNTS, label: "Mes Emprunts"},
    ...(isAdmin()
      ? [{ key: SECTIONS.ADMIN, label: "Gestion Admin" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-primary text-white flex-shrink-0 hidden md:flex flex-col py-6 gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors text-left ${
                section === item.key
                  ? "bg-white/10 text-gold border-r-4 border-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-primary flex z-40 border-t border-white/10">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
                section === item.key ? "text-gold" : "text-white/60"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <h2 className="text-3xl font-bold text-primary">Tableau De Bord</h2>
          <Stats/>
          {/* Catalogue */}
          {section === SECTIONS.CATALOGUE && (
            <div className="space-y-5 pt-[170px]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Catalogue des livres</h2>
              </div>
              <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou auteur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-primary/40" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <p className="text-gray-400 text-center py-12">Aucun livre trouvé.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      isAdmin={isAdmin()}
                      onBorrow={handleBorrow}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mes Emprunts */}
          {section === SECTIONS.EMPRUNTS && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary">
                {isAdmin() ? "Tous les emprunts" : "Mes emprunts"}
              </h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-primary/40" />
                </div>
              ) : borrows.length === 0 ? (
                <p className="text-gray-400 text-center py-12">Aucun emprunt.</p>
              ) : (
                <BorrowTable borrows={borrows} onReturn={handleReturn} />
              )}
            </div>
          )}

          {/* Gestion Admin */}
          {section === SECTIONS.ADMIN && isAdmin() && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Crown size={20} className="text-gold" />
                  Gestion des livres
                </h2>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 bg-gold text-primary font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  <Plus size={16} />
                  Ajouter un livre
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-primary/40" />
                </div>
              ) : books.length === 0 ? (
                <p className="text-gray-400 text-center py-12">Aucun livre enregistré.</p>
              ) : (
                <BookTable books={books} onEdit={openEditModal} onDelete={handleDelete} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Book modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBook ? "Modifier le livre" : "Ajouter un livre"}
      >
        <form onSubmit={handleSaveBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              required
              value={bookForm.titre}
              onChange={(e) => setBookForm((p) => ({ ...p, titre: e.target.value }))}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Auteur</label>
            <input
              type="text"
              required
              value={bookForm.auteur}
              onChange={(e) => setBookForm((p) => ({ ...p, auteur: e.target.value }))}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              required
              value={bookForm.isbn}
              onChange={(e) => setBookForm((p) => ({ ...p, isbn: e.target.value }))}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponible"
              checked={bookForm.disponible}
              onChange={(e) => setBookForm((p) => ({ ...p, disponible: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="disponible" className="text-sm text-gray-700">
              Disponible
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
