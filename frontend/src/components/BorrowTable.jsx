import { RotateCcw } from "lucide-react";

export default function BorrowTable({ borrows, onReturn }) {
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("fr-FR") : "—";

  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="w-full text-sm bg-white">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-3 text-left">Titre</th>
            <th className="px-4 py-3 text-left">Date Emprunt</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow, i) => (
            <tr
              key={borrow._id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {borrow.livre?.titre || borrow.livreId}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatDate(borrow.createdAt || borrow.dateEmprunt)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    borrow.statut === "en_cours"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {borrow.statut === "en_cours" ? "En cours" : "Retourné"}
                </span>
              </td>
              <td className="px-4 py-3">
                {borrow.statut === "en_cours" && (
                  <button
                    onClick={() => onReturn(borrow._id)}
                    className="flex items-center gap-1 bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <RotateCcw size={12} />
                    Retourner
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
