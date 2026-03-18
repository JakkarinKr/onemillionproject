// app/items/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type Item = Record<string, unknown>;

const PAGE_SIZE = 10;

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/Items")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(() => (items.length > 0 ? Object.keys(items[0]) : []), [items]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items
      .filter((row) => columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q)))
      .sort((a, b) => {
        if (!sortKey) return 0;
        const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [items, search, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderCell = (val: unknown) => {
    if (val === null || val === undefined)
      return <span style={{ color: "var(--muted)", fontStyle: "italic" }}>—</span>;
    if (typeof val === "boolean")
      return (
        <span style={{ color: val ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
          {val ? "Yes" : "No"}
        </span>
      );
    if (typeof val === "object") return <code style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{JSON.stringify(val)}</code>;
    const str = String(val);
    const lower = str.toLowerCase();
    const statusMap: Record<string, { bg: string; color: string }> = {
      active:   { bg: "rgba(74,222,128,0.12)",  color: "#4ade80" },
      inactive: { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
      pending:  { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
      draft:    { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
    };
    if (statusMap[lower]) {
      const s = statusMap[lower];
      return (
        <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em" }}>
          {str}
        </span>
      );
    }
    return str;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        :root {
          --bg: #0d0d10;
          --surface: #141418;
          --surface2: #1a1a20;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.04);
          --text: #e2e2e8;
          --muted: rgba(255,255,255,0.35);
          --label: rgba(255,255,255,0.5);
          --green: #4ade80;
          --red: #f87171;
          --radius: 10px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          font-family: 'IBM Plex Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          padding: 2.5rem 2rem;
        }

        /* Header */
        .page__header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page__title-group {}

        .page__eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.3rem;
        }

        .page__title {
          font-size: 1.6rem;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #f0f0f5;
        }

        .page__count {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 0.2rem;
        }

        /* Search */
        .search-wrap {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          font-size: 0.85rem;
          pointer-events: none;
        }

        .search-input {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.83rem;
          padding: 0.5rem 0.85rem 0.5rem 2.1rem;
          width: 240px;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--accent); }

        /* Table card */
        .table-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.83rem;
        }

        thead tr {
          border-bottom: 1px solid var(--border);
        }

        th {
          padding: 0.7rem 1rem;
          text-align: left;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--label);
          background: var(--surface2);
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          transition: color 0.15s;
        }

        th:hover { color: var(--text); }
        th.active { color: var(--accent); }

        th .sort-arrow {
          margin-left: 4px;
          opacity: 0.5;
          font-size: 0.6rem;
        }

        th.active .sort-arrow { opacity: 1; }

        td {
          padding: 0.7rem 1rem;
          color: var(--text);
          border-bottom: 1px solid var(--border2);
          white-space: nowrap;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.1s;
        }

        tbody tr:hover { background: var(--row-hover); }
        tbody tr:last-child td { border-bottom: none; }

        /* Empty / loading states */
        .state-row td {
          text-align: center;
          padding: 4rem 1rem;
          color: var(--muted);
          font-size: 0.85rem;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-banner {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.83rem;
          margin-bottom: 1.25rem;
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border);
          gap: 1rem;
          flex-wrap: wrap;
        }

        .pagination__info {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: var(--muted);
        }

        .pagination__btns {
          display: flex;
          gap: 0.25rem;
        }

        .pagination__btn {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--label);
          font-size: 0.78rem;
          font-family: 'IBM Plex Mono', monospace;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          min-width: 32px;
          text-align: center;
        }

        .pagination__btn:hover:not(:disabled) {
          color: var(--text);
          border-color: rgba(255,255,255,0.15);
        }

        .pagination__btn--active {
          background: var(--accent-dim);
          border-color: var(--accent);
          color: var(--accent);
        }

        .pagination__btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
          .btn-add {
          background:var(--accent);
          color:#0d0d10;
          font-family:'IBM Plex Sans',sans-serif;
          font-size:0.82rem;
          font-weight:600;
          padding:0.45rem 1.1rem;
          border:none;
          border-radius:8px;
          cursor:pointer;
          transition:opacity 0.15s;
          white-space:nowrap;
        }
        .btn-add:hover { opacity:0.85; }
      `}</style>

      <div className="page">
        <div className="page__header">
          <div className="page__title-group">
            <div className="page__eyebrow">Database</div>
            <h1 className="page__title">Items</h1>
            {!loading && (
              <div className="page__count">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                {search && ` matching "${search}"`}
              </div>
              
            )}
          </div>

          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search items…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
                <Link href="/Items/add" className="btn-add">
                + เพิ่มรายการ
                </Link>
          </div>

        {error && <div className="error-banner">⚠ {error}</div>}

        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className={sortKey === col ? "active" : ""}
                      onClick={() => handleSort(col)}
                    >
                      {col}
                      <span className="sort-arrow">
                        {sortKey === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="state-row">
                    <td colSpan={Math.max(columns.length, 1)}>
                      <span className="spinner" />
                      Loading…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr className="state-row">
                    <td colSpan={Math.max(columns.length, 1)}>
                      {search ? `No results for "${search}"` : "No items found"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col}>{renderCell(row[col])}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="pagination">
              <span className="pagination__info">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="pagination__btns">
                <button
                  className="pagination__btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="pagination__btn" style={{ cursor: "default" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`pagination__btn${page === p ? " pagination__btn--active" : ""}`}
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  className="pagination__btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}