// src/components/FarmhillLogin.jsx — REPLACE
// Logic CSV fetch + handleLogin tetap dari versi asli, hanya tampilan diganti.

import { useState } from "react";
import { useTheme } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHButton, FHField, FHInput } from "./ui";

const LOGIN_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAAQyMxxIm9d_n39M0kmJOQrFakQk1HcA3KbNSlOq_FDyMDPg-LlXR9kw1uFV0EAQOsUVUlrhVZ9TI/pub?gid=0&single=true&output=csv";

export default function FarmhillLogin({ onLoginSuccess }) {
  const { theme } = useTheme();
  const [nama, setNama] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(LOGIN_CSV_URL);
      const csv = await res.text();
      const rows = csv.split("\n").map(r => r.split(",").map(c => c.trim()));
      const found = rows.slice(1).find(r =>
        r[0]?.toLowerCase() === nama.trim().toLowerCase() && r[1] === id.trim());
      if (found) {
        localStorage.setItem("farmhill_user", JSON.stringify({ nama: found[0], id: found[1] }));
        onLoginSuccess?.({ nama: found[0], id: found[1] });
      } else {
        setError("Nama atau ID tidak ditemukan. Periksa lagi.");
      }
    } catch (err) {
      setError("Gagal koneksi. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100dvh", background: theme.bg, color: theme.text,
      display: "flex", flexDirection: "column", padding: "24px 20px",
    }}>
      {/* Brand */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: theme.chipBg, border: `1.5px solid ${theme.chipBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28, color: theme.primary,
        }}><FHIcon name="leaf" size={32}/></div>
        <div style={{ fontSize: 11, color: theme.primary, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
          THE FARMHILL · OPERATOR
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.6px", margin: "0 0 8px", lineHeight: 1.1 }}>
          Form Lapangan
        </h1>
        <p style={{ fontSize: 14, color: theme.textDim, margin: 0 }}>
          Masuk dengan nama lengkap dan ID kamu.
        </p>

        <form onSubmit={handleLogin} style={{ marginTop: 36 }}>
          <FHField theme={theme} label="Nama Lengkap" required>
            <FHInput theme={theme} value={nama} onChange={setNama} placeholder="cth. Budi Santoso" autoComplete="name"/>
          </FHField>
          <FHField theme={theme} label="ID Operator" required hint="6 digit">
            <FHInput theme={theme} value={id} onChange={setId} placeholder="••••••" type="password" inputMode="numeric"/>
          </FHField>

          {error && (
            <div style={{
              background: `color-mix(in oklch, ${theme.danger} 14%, transparent)`,
              border: `1px solid ${theme.danger}`, borderRadius: 12,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              color: theme.danger, fontSize: 13, fontWeight: 600, marginBottom: 16,
            }}>
              <FHIcon name="warn" size={18}/> {error}
            </div>
          )}

          <FHButton theme={theme} type="submit" full disabled={loading || !nama || !id}>
            {loading ? "Memuat…" : "Masuk"}
          </FHButton>
        </form>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: "12px 14px", borderRadius: 12,
        background: theme.bgElev, border: `1px solid ${theme.line}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 8, background: theme.success, flexShrink: 0 }}/>
        <span style={{ fontSize: 11, color: theme.textDim }}>
          Bisa offline · Data sync otomatis saat ada sinyal
        </span>
      </div>
    </div>
  );
}
