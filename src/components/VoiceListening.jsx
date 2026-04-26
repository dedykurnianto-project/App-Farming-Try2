// src/components/VoiceListening.jsx — NEW
// Overlay saat user tekan tombol mic di FHNumberInput. Pakai Web Speech API.
// Auto-stop setelah dapet angka. Fallback gracefully kalau API tidak ada.

import { useEffect, useState } from "react";
import { useTheme } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHButton } from "./ui";

const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function VoiceListening({ onResult, onClose, label = "Sebutkan angka" }) {
  const { theme } = useTheme();
  const [transcript, setTranscript] = useState("");
  const [err, setErr] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!SR) { setErr("Browser tidak mendukung input suara."); return; }
    const rec = new SR();
    rec.lang = "id-ID";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => setErr("Error: " + (e.error || "tak dikenal"));
    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const text = last[0].transcript;
      setTranscript(text);
      if (last.isFinal) {
        // extract digits
        const num = text.replace(/[^0-9.,]/g, "").replace(",", ".");
        if (num) onResult?.(num);
        else setErr(`Tidak terdeteksi angka dari "${text}"`);
      }
    };
    rec.start();
    return () => rec.abort();
  }, [onResult]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 130,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 360, padding: "32px 24px",
        background: theme.bgElev, border: `1px solid ${theme.line}`, borderRadius: 20,
        textAlign: "center", color: theme.text,
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: 48, margin: "0 auto 18px",
          background: theme.chipBg, color: theme.primary,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {listening && (
            <span style={{
              position: "absolute", inset: -8, borderRadius: 56,
              border: `2px solid ${theme.primary}`, opacity: 0.5,
              animation: "pulse 1.5s ease-out infinite",
            }}/>
          )}
          <FHIcon name="mic" size={42}/>
        </div>
        <div style={{ fontSize: 11, color: theme.primary, fontWeight: 800, letterSpacing: 1.6 }}>
          {listening ? "MENDENGARKAN…" : "BERSIAP"}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{label}</div>
        <div style={{
          marginTop: 18, padding: "14px 12px", borderRadius: 12,
          background: theme.bg, border: `1px solid ${theme.line}`,
          fontSize: 16, fontVariantNumeric: "tabular-nums", minHeight: 52,
          color: transcript ? theme.text : theme.textMute, fontWeight: 600,
        }}>
          {transcript || "—"}
        </div>
        {err && <div style={{ marginTop: 10, color: theme.danger, fontSize: 12 }}>{err}</div>}
        <div style={{ marginTop: 18 }}>
          <FHButton theme={theme} variant="ghost" full onClick={onClose}>Batal</FHButton>
        </div>
      </div>
      <style>{`@keyframes pulse{0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.4);opacity:0}}`}</style>
    </div>
  );
}
