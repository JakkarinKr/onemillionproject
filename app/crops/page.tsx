"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Crop {
  id: string;
  crop_name: string;
  botanical_name: string;
  variety: string;
  hero_image_url: string | null;
  status: string;
  category_name: string | null;
  water_need: string | null;
  sunlight_requirement: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const DIFFICULTY_MAP: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
};

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/crops").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([cropData, catData]) => {
        setCrops(cropData.crops || []);
        setCategories(catData.categories || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = crops.filter((c) => {
    const matchSearch =
      c.crop_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.botanical_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "all" ||
      c.category_name?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.page}>
      {/* Hero Header */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Crop Encyclopedia</h1>
        <p className={styles.heroSub}>
          Discover the wisdom of the earth. From heirloom tomatoes to hardy kale,
          explore our curated guide to growing your own sustainable harvest.
        </p>

        {/* Search */}
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search for a crop (e.g. Radish)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className={styles.filters}>
          <button
            className={styles.filterBtn + (activeCategory === "all" ? " " + styles.filterBtnActive : "")}
            onClick={() => setActiveCategory("all")}
          >
            ALL CROPS
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={styles.filterBtn + (activeCategory === cat.name ? " " + styles.filterBtnActive : "")}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.icon} {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.empty}>Loading crops...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No crops found.</p>
          <Link href="/crops/create" className={styles.addBtn}>+ Add your first crop</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((crop) => {
            const difficulty = DIFFICULTY_MAP[crop.water_need || "low"] || 1;
            return (
              <Link key={crop.id} href={"/crops/" + crop.id} className={styles.card}>
                <div className={styles.cardImage}>
                  {crop.hero_image_url ? (
                    <img src={crop.hero_image_url} alt={crop.crop_name} />
                  ) : (
                    <div className={styles.cardImagePlaceholder}>🌱</div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardName}>{crop.crop_name}</h3>
                    {crop.category_name && (
                      <span className={styles.cardCategory}>{crop.category_name.toUpperCase()}</span>
                    )}
                  </div>
                  <p className={styles.cardSeason}>
                    <span className={styles.seasonDot}>✿</span>
                    {crop.variety || "Unknown variety"}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.difficulty}>
                      <span className={styles.difficultyLabel}>DIFFICULTY</span>
                      <div className={styles.difficultyDots}>
                        {[1, 2, 3].map((d) => (
                          <span
                            key={d}
                            className={styles.dot + (d <= difficulty ? " " + styles.dotFilled : "")}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={styles.addCircleBtn}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <Link href="/crops/create" className={styles.fab}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3v16M3 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Link>
    </div>
  );
}