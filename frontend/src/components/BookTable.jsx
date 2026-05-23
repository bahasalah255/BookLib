import { Pencil, Trash2 } from "lucide-react";

export default function BookTable({ books, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="w-full text-sm bg-white">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-3 text-left">Titre</th>
            <th className="px-4 py-3 text-left">Auteur</th>
            <th className="px-4 py-3 text-left">ISBN</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, i) => (
            <tr
              key={book._id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 font-medium text-gray-800">{book.titre}</td>
              <td className="px-4 py-3 text-gray-600">{book.auteur}</td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{book.isbn}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    book.disponible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {book.disponible ? "Disponible" : "Indisponible"}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  onClick={() => onEdit(book)}
                  className="flex items-center gap-1 bg-gold text-primary text-xs px-2 py-1 rounded-lg hover:opacity-90 font-bold"
                >
                  <Pencil size={12} />
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(book._id)}
                  className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:opacity-90"
                >
                  <Trash2 size={12} />
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
