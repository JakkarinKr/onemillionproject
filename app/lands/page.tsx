"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Land {
  id: string;
  name: string;
  area: number | null;
  area_unit: string;
  soil_type: string | null;
  location: string | null;
  notes: string | null;
  crop_count: number;
  created_at: string;
}

export default function LandsPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lands")
      .then((r) => r.json())
      .then((data) => setLands(data.lands || []))
      .catch(() => setLands([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Lands</h1>
          <p className={styles.subtitle}>Manage your planting areas and assigned crops</p>
        </div>
        <Link href="/lands/create" className={styles.addBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Land
        </Link>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : lands.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🌾</div>
          <p>No lands yet. Add your first planting area.</p>
          <Link href="/lands/create" className={styles.addBtn}>+ Add Land</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {lands.map((land) => (
            <Link key={land.id} href={"/lands/" + land.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.landIcon}>🌿</div>
                <div className={styles.cropCountBadge}>
                  {land.crop_count} {Number(land.crop_count) === 1 ? "crop" : "crops"}
                </div>
              </div>
              <h3 className={styles.landName}>{land.name}</h3>
              <div className={styles.landMeta}>
                {land.area && (
                  <span className={styles.metaItem}>
                    📐 {land.area} {land.area_unit}
                  </span>
                )}
                {land.soil_type && (
                  <span className={styles.metaItem}>🧱 {land.soil_type}</span>
                )}
                {land.location && (
                  <span className={styles.metaItem}>📍 {land.location}</span>
                )}
              </div>
              {land.notes && <p className={styles.landNotes}>{land.notes}</p>}
              <div className={styles.cardFooter}>
                <span className={styles.viewLink}>View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}