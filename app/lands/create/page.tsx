"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface FormData {
  name: string;
  area: string;
  areaUnit: string;
  soilType: string;
  location: string;
  notes: string;
}

export default function CreateLandPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    area: "",
    areaUnit: "rai",
    soilType: "",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Land name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          area: form.area ? parseFloat(form.area) : null,
          areaUnit: form.areaUnit,
          soilType: form.soilType || null,
          location: form.location || null,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.error || "Failed to save"));
        return;
      }
      router.push("/lands");
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
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className={styles.headerTitle}>Add New Land</h1>
        <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Land"}
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Land Information</h2>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Land Name *</label>
            <input
              className={styles.input + (errors.name ? " " + styles.inputError : "")}
              placeholder="e.g. North Field, Greenhouse A"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Area</label>
              <input
                className={styles.input}
                placeholder="e.g. 2.5"
                type="number"
                value={form.area}
                onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Unit</label>
              <select
                className={styles.select}
                value={form.areaUnit}
                onChange={(e) => setForm((p) => ({ ...p, areaUnit: e.target.value }))}
              >
                <option value="rai">Rai</option>
                <option value="sqm">Sq. Meter</option>
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Soil Type</label>
            <select
              className={styles.select}
              value={form.soilType}
              onChange={(e) => setForm((p) => ({ ...p, soilType: e.target.value }))}
            >
              <option value="">Select soil type...</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
              <option value="Silty">Silty</option>
              <option value="Peaty">Peaty</option>
              <option value="Chalky">Chalky</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              placeholder="e.g. North section, near the barn"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Notes</label>
            <textarea
              className={styles.textarea}
              placeholder="Any additional notes about this land..."
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={4}
            />
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🌾</div>
          <div>
            <strong>What is a Land?</strong>
            <p>A land represents a physical planting area in your farm. After creating a land, you can assign crops to it and track what is growing where.</p>
          </div>
        </div>
      </div>
    </div>
  );
}