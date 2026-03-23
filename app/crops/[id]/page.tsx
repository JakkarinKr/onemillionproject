"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface PlantingStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
}

interface CropDetail {
  id: string;
  crop_name: string;
  botanical_name: string;
  variety: string;
  hero_image_url: string | null;
  status: string;
  category_name: string | null;
  sunlight_requirement: string | null;
  water_need: string | null;
  soil_ph_min: string | null;
  soil_ph_max: string | null;
  spacing: string | null;
  is_organic_certified: boolean;
  planting_steps: PlantingStep[];
}

export default function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crops/" + id)
      .then((r) => r.json())
      .then((data) => setCrop(data.crop || null))
      .catch(() => setCrop(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!crop) {
    return (
      <div className={styles.loading}>
        <p>Crop not found.</p>
        <Link href="/crops" className={styles.backLink}>Back to crops</Link>
      </div>
    );
  }

  const soilPh =
    crop.soil_ph_min && crop.soil_ph_max
      ? crop.soil_ph_min + " - " + crop.soil_ph_max
      : crop.soil_ph_min || "—";

  return (
    <div className={styles.page}>
      {/* Top Section */}
      <div className={styles.topSection}>
        {/* Left: Info */}
        <div className={styles.infoCol}>
          {crop.botanical_name && (
            <span className={styles.botanicalBadge}>{crop.botanical_name}</span>
          )}
          <h1 className={styles.title}>{crop.crop_name}</h1>
          <p className={styles.description}>
            {crop.variety
              ? "Variety: " + crop.variety + ". A remarkable crop with unique growing characteristics suited for sustainable farming."
              : "A remarkable crop with unique growing characteristics suited for sustainable farming."}
          </p>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add to Calendar
            </button>
            <Link href={"/crops/" + id + "/edit"} className={styles.editBtn}>
              Edit
            </Link>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className={styles.imageCol}>
          {crop.hero_image_url ? (
            <img src={crop.hero_image_url} alt={crop.crop_name} className={styles.heroImg} />
          ) : (
            <div className={styles.heroPlaceholder}>🌱</div>
          )}
          {crop.category_name && (
            <div className={styles.flavorCard}>
              <span className={styles.flavorLabel}>CATEGORY</span>
              <p className={styles.flavorText}>{crop.category_name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* Left: Quick Facts + Pro Tips */}
        <div className={styles.sideCol}>
          <div className={styles.quickFacts}>
            <h2 className={styles.quickFactsTitle}>
              <span className={styles.qfIcon}>i</span> Quick Facts
            </h2>
            <div className={styles.factItem}>
              <div className={styles.factIcon}>☀️</div>
              <div>
                <div className={styles.factLabel}>SUNLIGHT</div>
                <div className={styles.factValue}>{crop.sunlight_requirement || "Full Sun (6-8 hours)"}</div>
              </div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factIcon}>💧</div>
              <div>
                <div className={styles.factLabel}>WATER</div>
                <div className={styles.factValue}>
                  {crop.water_need === "low"
                    ? "1 inch per week"
                    : crop.water_need === "moderate"
                    ? "1-2 inches per week"
                    : crop.water_need === "high"
                    ? "2-3 inches per week"
                    : "1-2 inches per week"}
                </div>
              </div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factIcon}>🧪</div>
              <div>
                <div className={styles.factLabel}>SOIL PH</div>
                <div className={styles.factValue}>{soilPh}</div>
              </div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factIcon}>📏</div>
              <div>
                <div className={styles.factLabel}>SPACING</div>
                <div className={styles.factValue}>{crop.spacing || "18-24 inches apart"}</div>
              </div>
            </div>
          </div>

          <div className={styles.proTips}>
            <h3 className={styles.proTipsTitle}>
              <span>🌿</span> Pro Tips
            </h3>
            <p className={styles.proTipsText}>
              Soil preparation is key. Amend your beds with at least 2 inches of well-rotted compost.
              Add a handful of bone meal to each planting hole to prevent common deficiencies.
              {crop.is_organic_certified && " This crop is organically certified."}
            </p>
          </div>
        </div>

        {/* Right: Steps + Companion */}
        <div className={styles.mainCol}>
          {crop.planting_steps && crop.planting_steps.length > 0 && (
            <div className={styles.stepsSection}>
              <h2 className={styles.sectionTitle}>Step-by-Step Guide</h2>
              <div className={styles.steps}>
                {crop.planting_steps
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((step) => (
                    <div key={step.id} className={styles.stepItem}>
                      <div className={styles.stepNum}>{step.step_number}</div>
                      <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>{step.title}</h4>
                        <p className={styles.stepDesc}>{step.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className={styles.companionSection}>
            <h2 className={styles.sectionTitle}>Companion Planting</h2>
          </div>
        </div>
      </div>
    </div>
  );
}