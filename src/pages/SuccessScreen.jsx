// src/pages/SuccessScreen.jsx — NEW
// Tampilan setelah submit sukses. Standalone agar bisa dipakai 8 form yang sama.

import { useEffect } from "react";
import { useTheme, FH_MODULES } from "../theme/tokens";
import FHIcon from "../components/FHIcon";
import { FHButton } from "../components/ui";

export default function SuccessScreen({
  menuKey, gh, queued = false, onDone, onAnother, autoBackMs = 0,
}) {
  const { theme } = useTheme();
  const m = FH_MODULES[menuKey];

  useEffect(() => {
    if (autoBackMs > 0) {
      const t = setTimeout(() => onDone?.(), autoBackMs);
      return () => clearTimeout(t);
    }
  }, [autoBackMs, onDone]);

  return (
    <div style={{
      background: theme.bg, color: theme.text, minHeight: "100dvh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", textAlign: "center",
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 48,
        background: queued
          ? `color-mix(in oklch, ${theme.warn} 16%, transparent)`
          : `color-mix(in oklch, ${theme.success} 16%, transparent)`,
        border: `1.5px solid ${queued ? theme.warn : theme.success}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <FHIcon name={queued ? "cloud-up" : "check-circle"} size={44}
          color={queued ? theme.warn : theme.success} stroke={2.4}/>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: queued ? theme.warn : theme.success, letterSpacing: 1.6 }}>
        {queued ? "TERSIMPAN OFFLINE" : "DATA TERKIRIM"}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginTop: 6, lineHeight: 1.15 }}>
        {queued ? "Akan dikirim saat online" : "Terima kasih, data tercatat"}
      </div>
      <div style={{ fontSize: 14, color: theme.textDim, marginTop: 10, maxWidth: 320, lineHeight: 1.5 }}>
        {m?.label} · {gh}
        <br/>
        {queued
          ? "Data aman tersimpan di perangkat. Otomatis terkirim begitu sinyal kembali."
          : "Bisa dilihat di dashboard admin dalam beberapa menit."}
      </div>

      <div style={{ marginTop: 36, width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
        <FHButton theme={theme} full onClick={onAnother}>Input Lagi ({m?.short})</FHButton>
        <FHButton theme={theme} variant="ghost" full onClick={onDone}>Kembali ke Beranda</FHButton>
      </div>
    </div>
  );
}
