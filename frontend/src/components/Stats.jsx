import { useEffect, useState } from "react";
import { countusers } from "../api/auth";
import { getAllBooks } from "../api/books";
import { getAllBorrows, getMyBorrows } from "../api/borrows";
import { useAuth } from "../context/AuthContext";

export default function Stats() {
  const { token, isAdmin } = useAuth();
  const [stats, setStats] = useState({ users: 0, books: 0, borrows: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      setLoading(true);

      try {
        const [usersRes, booksRes, borrowsRes] = await Promise.all([
          countusers(),
          getAllBooks(token),
          isAdmin() ? getAllBorrows(token) : getMyBorrows(token),
        ]);

        if (!active) return;

        setStats({
          users: Number(usersRes.data?.count ?? 0),
          books: Array.isArray(booksRes.data) ? booksRes.data.length : 0,
          borrows: Array.isArray(borrowsRes.data) ? borrowsRes.data.length : 0,
        });
      } catch {
        if (!active) return;

        setStats({ users: 0, books: 0, borrows: 0 });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, [token, isAdmin]);

  const cards = [
    { label: "Total Users", value: stats.users },
    { label: "Total Books", value: stats.books },
    { label: "Total Emprunts", value: stats.borrows },
  ];

  return (
    <div className="pt-7 grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-blue-500 p-6 text-white shadow-sm">
          <div className="text-sm font-medium uppercase tracking-wide text-white/80">{card.label}</div>
          <div className="mt-3 text-3xl font-bold">
            {loading ? "..." : card.value}
          </div>
        </div>
      ))}
    </div>
  );
}