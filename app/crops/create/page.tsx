"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type WaterNeed = "low" | "moderate" | "high";
type SunlightOption = "Full Sun (6-8 hours)" | "Partial Sun (3-6 hours)" | "Full Shade (less than 3 hours)";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface PlantingStep {
  id: string;
  title: string;
  description: string;
}

interface FormData {
  cropName: string;
  botanicalName: string;
  variety: string;
  categoryId: string;
  heroImage: File | null;
  heroImagePreview: string | null;
  sunlight: SunlightOption;
  waterNeed: WaterNeed;
  soilPhMin: string;
  soilPhMax: string;
  spacing: string;
  isOrganicCertified: boolean;
  plantingSteps: PlantingStep[];
}

export default function CreateCropPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormData>({
    cropName: "",
    botanicalName: "",
    variety: "",
    categoryId: "",
    heroImage: null,
    heroImagePreview: null,
    sunlight: "Full Sun (6-8 hours)",
    waterNeed: "moderate",
    soilPhMin: "",
    soilPhMax: "",
    spacing: "",
    isOrganicCertified: true,
    plantingSteps: [{ id: "1", title: "", description: "" }],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {
        setCategories([
          { id: "", name: "Vegetable", icon: "🥦" },
          { id: "", name: "Fruit", icon: "🍎" },
          { id: "", name: "Herb", icon: "🌿" },
        ]);
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, heroImage: file, heroImagePreview: preview }));
  };

  const handleAddStep = () => {
    const newStep: PlantingStep = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setForm((prev) => ({
      ...prev,
      plantingSteps: [...prev.plantingSteps, newStep],
    }));
    setActiveStepId(newStep.id);
  };

  const handleStepChange = (id: string, field: keyof PlantingStep, value: string) => {
    setForm((prev) => ({
      ...prev,
      plantingSteps: prev.plantingSteps.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.cropName.trim()) newErrors.cropName = "Crop name is required";
    if (!form.botanicalName.trim()) newErrors.botanicalName = "Botanical name is required";
    if (!form.categoryId) newErrors.categoryId = "Please select a category";
    if (!form.soilPhMin.trim()) newErrors.soilPh = "Soil pH is required";
    if (!form.spacing.trim()) newErrors.spacing = "Spacing is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: form.categoryId || null,
          cropName: form.cropName,
          botanicalName: form.botanicalName,
          variety: form.variety,
          heroImageUrl: null,
          status,
          sunlightRequirement: form.sunlight,
          waterNeed: form.waterNeed,
          soilPhMin: form.soilPhMin || null,
          soilPhMax: form.soilPhMax || null,
          spacing: form.spacing,
          isOrganicCertified: form.isOrganicCertified,
          plantingSteps: form.plantingSteps.filter((s) => s.title || s.description),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error || "Failed to save crop"));
        return;
      }

      router.push("/crops");
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <h1 className={styles.headerTitle}>New Crop Entry</h1>
        <div className={styles.headerActions}>
          <button className={styles.draftBtn} onClick={() => handleSave("draft")} disabled={isSaving}>
            Save Draft
          </button>
          <button className={styles.saveBtn} onClick={() => handleSave("published")} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Crop"}
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <div
            className={styles.imageUpload}
            onClick={() => fileInputRef.current?.click()}
            style={form.heroImagePreview ? { padding: 0, overflow: "hidden" } : {}}
          >
            {form.heroImagePreview ? (
              <img src={form.heroImagePreview} alt="preview" className={styles.imagePreview} />
            ) : (
              <>
                <div className={styles.imageIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="19.5" cy="9.5" r="1" fill="currentColor" />
                  </svg>
                </div>
                <p className={styles.imageLabel}>Upload Hero Image</p>
                <p className={styles.imageHint}>Recommended size: 1200x800px (JPG, PNG)</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className={styles.fileInput}
              onChange={handleImageUpload}
            />
          </div>

          <div className={styles.card}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Crop Name</label>
              <input
                className={styles.input + (errors.cropName ? " " + styles.inputError : "")}
                placeholder="e.g. Heirloom Tomato"
                value={form.cropName}
                onChange={(e) => setForm((p) => ({ ...p, cropName: e.target.value }))}
              />
              {errors.cropName && <p className={styles.errorMsg}>{errors.cropName}</p>}
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Botanical Name</label>
                <input
                  className={styles.input + (errors.botanicalName ? " " + styles.inputError : "")}
                  placeholder="e.g. Solanum lycopersicum"
                  value={form.botanicalName}
                  onChange={(e) => setForm((p) => ({ ...p, botanicalName: e.target.value }))}
                />
                {errors.botanicalName && <p className={styles.errorMsg}>{errors.botanicalName}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Variety</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Brandywine Pink"
                  value={form.variety}
                  onChange={(e) => setForm((p) => ({ ...p, variety: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Category</label>
              <div className={styles.categoryGroup}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={styles.categoryBtn + (form.categoryId === cat.id ? " " + styles.categoryBtnActive : "")}
                    onClick={() => setForm((p) => ({ ...p, categoryId: cat.id }))}
                    type="button"
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              {errors.categoryId && <p className={styles.errorMsg}>{errors.categoryId}</p>}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Step-by-Step Planting Guide</h2>
              <button className={styles.addStepBtn} onClick={handleAddStep} type="button">
                + Add Step
              </button>
            </div>

            <div className={styles.steps}>
              {form.plantingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={styles.stepCard + (activeStepId === step.id ? " " + styles.stepCardActive : "")}
                  onClick={() => setActiveStepId(step.id)}
                >
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepContent}>
                    {activeStepId === step.id || step.title ? (
                      <>
                        <input
                          className={styles.stepTitle}
                          placeholder="Step title e.g. Seed Sowing"
                          value={step.title}
                          onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <textarea
                          className={styles.stepDesc}
                          placeholder="Step details..."
                          value={step.description}
                          onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          rows={3}
                        />
                      </>
                    ) : (
                      <p className={styles.stepPlaceholder}>Click to add step details...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardTitleIcon}>⚡</span>
              Quick Facts
            </h2>

            <div className={styles.factGroup}>
              <label className={styles.factLabel}>
                <span>☀️</span> Sunlight
              </label>
              <select
                className={styles.select}
                value={form.sunlight}
                onChange={(e) => setForm((p) => ({ ...p, sunlight: e.target.value as SunlightOption }))}
              >
                <option>Full Sun (6-8 hours)</option>
                <option>Partial Sun (3-6 hours)</option>
                <option>Full Shade (less than 3 hours)</option>
              </select>
            </div>

            <div className={styles.factGroup}>
              <label className={styles.factLabel}>
                <span>💧</span> Water Need
              </label>
              <div className={styles.toggleGroup}>
                {(["low", "moderate", "high"] as WaterNeed[]).map((w) => (
                  <button
                    key={w}
                    className={styles.toggleBtn + (form.waterNeed === w ? " " + styles.toggleBtnActive : "")}
                    onClick={() => setForm((p) => ({ ...p, waterNeed: w }))}
                    type="button"
                  >
                    {w === "low" ? "Low" : w === "moderate" ? "Moderate" : "High"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.factRow}>
              <div className={styles.factGroup}>
                <label className={styles.factLabel}>
                  <span>🧪</span> Soil pH
                </label>
                <input
                  className={styles.input + (errors.soilPh ? " " + styles.inputError : "")}
                  placeholder="6.0 - 6.8"
                  value={form.soilPhMin && form.soilPhMax ? form.soilPhMin + " - " + form.soilPhMax : form.soilPhMin}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parts = val.split("-").map((s) => s.trim());
                    setForm((p) => ({
                      ...p,
                      soilPhMin: parts[0] || "",
                      soilPhMax: parts[1] || "",
                    }));
                  }}
                />
                {errors.soilPh && <p className={styles.errorMsg}>{errors.soilPh}</p>}
              </div>
              <div className={styles.factGroup}>
                <label className={styles.factLabel}>
                  <span>📏</span> Spacing
                </label>
                <input
                  className={styles.input + (errors.spacing ? " " + styles.inputError : "")}
                  placeholder="18-24 in"
                  value={form.spacing}
                  onChange={(e) => setForm((p) => ({ ...p, spacing: e.target.value }))}
                />
                {errors.spacing && <p className={styles.errorMsg}>{errors.spacing}</p>}
              </div>
            </div>
          </div>

          <div className={styles.organicCard}>
            <div className={styles.organicIcon}>✓</div>
            <div className={styles.organicText}>
              <strong>Organic Certification</strong>
              <p>This crop will be tagged as organic by default based on your farm settings.</p>
              <button className={styles.organicLink}>Modify Settings →</button>
            </div>
          </div>

          <button
            className={styles.mainSaveBtn}
            onClick={() => handleSave("published")}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Crop Entry"}
          </button>
          <p className={styles.saveHint}>
            By saving, this crop will be added to your farm encyclopedia and active inventory.
          </p>
        </div>
      </div>
    </div>
  );
}