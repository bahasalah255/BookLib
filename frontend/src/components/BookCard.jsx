import { Pencil, Trash2, BookOpen } from "lucide-react";

export default function BookCard({ book, isAdmin, onBorrow, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen size={20} />
          <h3 className="font-semibold text-base leading-tight">{book.titre}</h3>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            book.disponible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {book.disponible ? "Disponible" : "Indisponible"}
        </span>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Auteur : </span>
          {book.auteur}
        </p>
        <p>
          <span className="font-medium text-gray-700">ISBN : </span>
          {book.isbn}
        </p>
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        {!isAdmin && book.disponible && (
          <button
            onClick={() => onBorrow(book._id)}
            className="flex-1 bg-primary text-white text-sm py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Emprunter
          </button>
        )}
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(book)}
              className="flex items-center gap-1 bg-gold text-primary text-sm px-3 py-2 rounded-lg hover:opacity-90 transition-opacity font-bold"
            >
              <Pencil size={14} />
              Modifier
            </button>
            <button
              onClick={() => onDelete(book._id)}
              className="flex items-center gap-1 bg-red-500 text-white text-sm px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Trash2 size={14} />
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
