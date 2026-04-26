// src/components/ConfirmSubmitModal.jsx — REPLACE
// Props: { data, onConfirm, onCancel, operatorName, onOperatorChange, foto, accent, title }

import { useTheme } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHButton, FHField, FHInput } from "./ui";

export default function ConfirmSubmitModal({
  data = [], onConfirm, onCancel, operatorName, onOperatorChange,
  foto, accent, title = "Konfirmasi Data",
}) {
  const { theme } = useTheme();
  const c = accent || theme.primary;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 110,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "stretch", justifyContent: "center",
    }}>
      <div style={{
        width: "100%", maxWidth: 520,
        background: theme.bg, color: theme.text,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${theme.line}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <button onClick={onCancel} style={{
            width: 40, height: 40, borderRadius: 10, border: `1px solid ${theme.line}`,
            background: theme.bgElev, color: theme.text,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><FHIcon name="chevron-left" size={20}/></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: c, fontWeight: 800, letterSpacing: 1.4 }}>REVIEW SEBELUM SUBMIT</div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>{title}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{
            background: `color-mix(in oklch, ${c} 10%, transparent)`,
            border: `1px solid ${c}`, borderRadius: 12,
            padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start",
            marginBottom: 16,
          }}>
            <FHIcon name="info" size={18} color={c} style={{ marginTop: 1, flexShrink: 0 }}/>
            <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5 }}>
              Cek satu-satu sebelum kirim. Setelah disubmit, data tidak bisa diedit sendiri.
            </div>
          </div>

          {/* Data list */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.line}`,
            borderRadius: 14, overflow: "hidden", marginBottom: 16,
          }}>
            {data.map((row, i) => (
              <div key={i} style={{
                padding: "12px 14px",
                borderBottom: i < data.length - 1 ? `1px solid ${theme.line}` : "none",
                display: "flex", justifyContent: "space-between", gap: 12,
              }}>
                <span style={{ fontSize: 12, color: theme.textDim, fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 14, color: theme.text, fontWeight: 700, textAlign: "right",
                  fontVariantNumeric: row.numeric ? "tabular-nums" : "normal" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Foto preview if any */}
          {foto && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.textDim, fontWeight: 700, marginBottom: 6 }}>Foto Bukti</div>
              <img src={foto} alt="" style={{
                width: "100%", borderRadius: 12, border: `1px solid ${theme.line}`,
              }}/>
            </div>
          )}

          {/* Operator */}
          <FHField theme={theme} label="Nama Operator" required hint="Yang bertanggung jawab">
            <FHInput theme={theme} value={operatorName} onChange={onOperatorChange} placeholder="Nama lengkap"/>
          </FHField>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px 24px", borderTop: `1px solid ${theme.line}`,
          background: theme.bg, display: "flex", gap: 10,
        }}>
          <FHButton theme={theme} variant="ghost" onClick={onCancel}>Edit</FHButton>
          <FHButton theme={theme} full color={c} disabled={!operatorName} onClick={onConfirm}>
            Kirim Data
          </FHButton>
        </div>
      </div>
    </div>
  );
}
