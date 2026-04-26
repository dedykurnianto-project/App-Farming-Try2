// src/components/FotoSelfie.jsx — REPLACE
// Props sama dengan versi asli: { onCapture, ghLabel }
// Logic kamera (getUserMedia) tetap.

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHButton } from "./ui";

export default function FotoSelfie({ onCapture, ghLabel }) {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [snap, setSnap] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(s => {
        if (!active) { s.getTracks().forEach(t => t.stop()); return; }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(e => setErr("Tidak bisa akses kamera. " + (e?.message || "")));
    return () => { active = false; stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  const capture = () => {
    const v = videoRef.current; if (!v) return;
    const canvas = canvasRef.current;
    canvas.width = v.videoWidth; canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(v, 0, 0);
    // Stamp
    const stamp = `${ghLabel || ""} · ${new Date().toLocaleString("id-ID")}`;
    ctx.font = `${Math.round(canvas.width / 28)}px sans-serif`;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    ctx.fillStyle = "#fff";
    ctx.fillText(stamp, 16, canvas.height - 22);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSnap(dataUrl);
  };

  const accept = () => {
    stream?.getTracks().forEach(t => t.stop());
    onCapture?.(snap);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 120, background: "#000",
      display: "flex", flexDirection: "column", color: "#fff",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.primary, fontWeight: 800, letterSpacing: 1.4 }}>FOTO BUKTI</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{ghLabel || "Selfie Operator"}</div>
        </div>
        <FHIcon name="camera" size={22} color="#fff"/>
      </div>

      {/* Viewport */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {snap ? (
          <img src={snap} alt="snap" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={{
            width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)",
          }}/>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}/>

        {/* Guide ring */}
        {!snap && (
          <div style={{
            position: "absolute", width: 240, height: 300, borderRadius: 200,
            border: "2px dashed rgba(255,255,255,0.5)", pointerEvents: "none",
          }}/>
        )}

        {/* Bottom hint */}
        {!snap && (
          <div style={{
            position: "absolute", bottom: 110, left: 16, right: 16, textAlign: "center",
            fontSize: 13, color: "rgba(255,255,255,0.85)",
          }}>
            Posisikan wajah di dalam lingkaran<br/>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
              Stempel GH & waktu otomatis ditambahkan
            </span>
          </div>
        )}

        {err && (
          <div style={{
            position: "absolute", top: 20, left: 16, right: 16,
            background: theme.danger, color: "#fff", borderRadius: 12,
            padding: "10px 14px", fontSize: 13, fontWeight: 600,
          }}>{err}</div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: "16px 20px 28px", display: "flex", gap: 10 }}>
        {!snap ? (
          <button onClick={capture} disabled={!stream} style={{
            flex: 1, height: 64, borderRadius: 32,
            background: theme.primary, color: theme.primaryInk, border: "none",
            fontSize: 16, fontWeight: 800,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            opacity: stream ? 1 : 0.5,
          }}>
            <FHIcon name="camera" size={22}/> Ambil Foto
          </button>
        ) : (
          <>
            <FHButton theme={theme} variant="ghost" onClick={() => setSnap(null)}>Ulangi</FHButton>
            <FHButton theme={theme} full onClick={accept} icon="check-circle">Pakai Foto</FHButton>
          </>
        )}
      </div>
    </div>
  );
}
