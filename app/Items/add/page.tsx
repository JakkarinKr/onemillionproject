// app/items/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddItemPage() {
  const router = useRouter();
  const [itemno, setItemno] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!itemno.trim() || !name.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/Itempost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemno: itemno.trim(), name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => router.push("/Items"), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .add-page {
          font-family: 'IBM Plex Sans', sans-serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .add-card {
          width: 100%;
          max-width: 480px;
          border-radius: 16px;
          padding: 2.5rem;
          background: var(--color-zinc-900);
        }

        /* Back link */
        .add-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--muted);
          text-decoration: none;
          margin-bottom: 1.75rem;
          transition: color 0.15s;
        }
        .add-back:hover { color: var(--text); }

        /* Header */
        .add-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.3rem;
        }

        .add-title {
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #f0f0f5;
          margin-bottom: 0.4rem;
        }

        .add-subtitle {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }

        /* Form card */
        .add-form-card {
          background: var(--color-zinc-900);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Field */
        .field { display: flex; flex-direction: column; gap: 0.4rem; }

        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--label);
        }

        .field-label span {
          color: var(--accent);
          margin-left: 2px;
        }

        .field-input {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.88rem;
          padding: 0.6rem 0.85rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }

        .field-input::placeholder { color: var(--muted); }

        .field-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .field-hint {
          font-size: 0.72rem;
          color: var(--muted);
        }

        /* Divider */
        .add-divider {
          height: 1px;
          background: var(--border);
          margin: 0.25rem 0;
        }

        /* Actions */
        .add-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .btn {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.83rem;
          font-weight: 500;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s, background 0.15s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--label);
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }

        .btn-primary {
          background: var(--accent);
          color: #0d0d10;
          font-weight: 600;
          min-width: 110px;
          justify-content: center;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; }

        /* Error */
        .add-error {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #f87171;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Success */
        .add-success {
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.2);
          color: #4ade80;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Spinner */
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(13,13,16,0.3);
          border-top-color: #0d0d10;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="add-page">
        <div className="add-card">
          <Link href="/Items" className="add-back">
            ← กลับไปหน้า Items
          </Link>

          <div className="add-eyebrow">Items</div>
          <h1 className="add-title">เพิ่มรายการใหม่</h1>
          <p className="add-subtitle">กรอกข้อมูลด้านล่างเพื่อเพิ่ม item เข้าฐานข้อมูล</p>

          <div className="add-form-card">
            {error && (
              <div className="add-error">⚠ {error}</div>
            )}
            {success && (
              <div className="add-success">✓ เพิ่มข้อมูลสำเร็จ กำลังกลับหน้า Items…</div>
            )}

            <div className="field">
              <label className="field-label">Item No <span>*</span></label>
              <input
                className="field-input"
                placeholder="เช่น 0002"
                value={itemno}
                onChange={(e) => setItemno(e.target.value)}
                disabled={loading || success}
              />
              <span className="field-hint">รหัสสินค้า ต้องไม่ซ้ำกัน</span>
            </div>

            <div className="field">
              <label className="field-label">Name <span>*</span></label>
              <input
                className="field-input"
                placeholder="เช่น Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <span className="field-hint">ชื่อสินค้า</span>
            </div>

            <div className="add-divider" />

            <div className="add-actions">
              <Link href="/Items" className="btn btn-ghost">ยกเลิก</Link>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || success}
              >
                {loading ? <span className="spinner" /> : "บันทึก →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}