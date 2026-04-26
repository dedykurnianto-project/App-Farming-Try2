// src/components/ui/index.jsx — semua UI primitives glove-friendly
// Import: import { FHHeader, FHButton, FHField, FHInput, FHNumberInput,
//                   FHNumPad, FHProgress, FHChip, FHCard, FHModulePill } from "./ui";

import { useState } from "react";
import FHIcon from "../FHIcon";
import { FH_MODULES, MODULE_ICON, moduleColor, moduleColorSoft } from "../../theme/tokens";

export function FHHeader({ theme, title, subtitle, onBack, right, accent }) {
  const c = accent || theme.primary;
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 5, background: theme.bg,
      borderBottom: `1px solid ${theme.line}`, padding: "12px 16px 14px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 44, height: 44, borderRadius: 12, border: `1px solid ${theme.line}`,
          background: theme.bgElev, color: theme.text, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}><FHIcon name="chevron-left" size={22}/></button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && <div style={{ fontSize: 11, color: c, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>{subtitle}</div>}
        <div style={{ fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: "-0.3px", lineHeight: 1.15 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

export function FHButton({ theme, variant = "primary", size = "lg", icon, children, onClick, color, disabled, full, type = "button" }) {
  const h = size === "lg" ? 56 : size === "md" ? 48 : 40;
  const fs = size === "lg" ? 17 : size === "md" ? 15 : 13;
  const c = color || theme.primary;
  const map = {
    primary:   { background: c, color: theme.primaryInk, border: "none" },
    secondary: { background: theme.bgElev, color: theme.text, border: `1px solid ${theme.lineStrong}` },
    ghost:     { background: "transparent", color: theme.text, border: `1px solid ${theme.line}` },
    danger:    { background: theme.danger, color: "#fff", border: "none" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...map[variant], height: h, padding: "0 20px", borderRadius: 14,
      fontSize: fs, fontWeight: 700, letterSpacing: "-0.1px",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      width: full ? "100%" : "auto", flexShrink: 0,
    }}>
      {icon && <FHIcon name={icon} size={20} stroke={2.4}/>}
      {children}
    </button>
  );
}

export function FHField({ theme, label, hint, required, children, error }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
          {label}{required && <span style={{ color: theme.danger, marginLeft: 4 }}>*</span>}
        </span>
        {hint && <span style={{ fontSize: 11, color: theme.textMute }}>{hint}</span>}
      </div>
      {children}
      {error && <div style={{ marginTop: 6, fontSize: 12, color: theme.danger }}>{error}</div>}
    </label>
  );
}

export function FHInput({ theme, value, onChange, placeholder, type = "text", suffix, big, ...rest }) {
  const h = big ? 64 : 56;
  return (
    <div style={{
      height: h, display: "flex", alignItems: "center",
      background: theme.inputBg, border: `1.5px solid ${theme.inputBorder}`,
      borderRadius: 14, padding: "0 16px", gap: 10,
    }}>
      <input
        type={type} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder} {...rest}
        style={{
          flex: 1, height: "100%", border: "none", background: "transparent",
          outline: "none", color: theme.text, fontSize: big ? 22 : 17, fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
        }}
      />
      {suffix && <span style={{ color: theme.textDim, fontSize: 14, fontWeight: 600 }}>{suffix}</span>}
    </div>
  );
}

// Number field with built-in voice + opens an external NumPad on tap (parent provides the pad)
export function FHNumberInput({ theme, value, onChange, suffix, onVoice, onOpenPad }) {
  return (
    <div style={{
      height: 64, display: "flex", alignItems: "center",
      background: theme.inputBg, border: `1.5px solid ${theme.inputBorder}`,
      borderRadius: 14, padding: "0 8px 0 16px", gap: 6,
    }}>
      <input
        readOnly={!!onOpenPad}
        value={value ?? ""}
        placeholder="0"
        onChange={(e) => onChange?.(e.target.value)}
        onClick={onOpenPad}
        style={{
          flex: 1, height: "100%", border: "none", background: "transparent",
          outline: "none", color: theme.text, fontSize: 24, fontWeight: 700,
          fontVariantNumeric: "tabular-nums", cursor: onOpenPad ? "pointer" : "text",
        }}
      />
      {suffix && <span style={{ color: theme.textDim, fontSize: 14, fontWeight: 700 }}>{suffix}</span>}
      {onVoice && (
        <button type="button" onClick={onVoice} style={{
          width: 44, height: 44, borderRadius: 10, border: `1px solid ${theme.line}`,
          background: theme.bgElev, color: theme.primary,
          display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4,
        }}><FHIcon name="mic" size={20}/></button>
      )}
    </div>
  );
}

// ATM-style numeric pad (controlled — parent owns the value)
export function FHNumPad({ theme, value, onChange, onClose, onVoice, onConfirm }) {
  const handleKey = (k) => {
    let v = String(value ?? "");
    if (k === "⌫") v = v.slice(0, -1);
    else if (k === "." && v.includes(".")) {/* skip */}
    else v = v + k;
    onChange?.(v);
  };
  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];
  return (
    <div style={{
      background: theme.bgElev, borderTop: `1px solid ${theme.line}`,
      padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 4px" }}>
        {onVoice ? (
          <button type="button" onClick={onVoice} style={{
            height: 36, padding: "0 12px", borderRadius: 10,
            background: theme.chipBg, border: `1px solid ${theme.chipBorder}`,
            color: theme.primary, fontSize: 12, fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}><FHIcon name="mic" size={14}/> Suara</button>
        ) : <span/>}
        <button type="button" onClick={onClose} style={{
          height: 36, padding: "0 12px", borderRadius: 10,
          background: "transparent", border: `1px solid ${theme.line}`,
          color: theme.textDim, fontSize: 12, fontWeight: 600,
        }}>Tutup</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {keys.map(k => (
          <button type="button" key={k} onClick={() => handleKey(k)} style={{
            height: 56, borderRadius: 12,
            background: theme.bgCard, border: `1px solid ${theme.line}`,
            color: theme.text, fontSize: 22, fontWeight: 700,
          }}>{k}</button>
        ))}
      </div>
      <button type="button" onClick={onConfirm} style={{
        height: 52, borderRadius: 12, marginTop: 4,
        background: theme.primary, color: theme.primaryInk, border: "none",
        fontSize: 16, fontWeight: 800,
      }}>Simpan</button>
    </div>
  );
}

export function FHProgress({ theme, sections, activeIdx, onJump, accent }) {
  const c = accent || theme.primary;
  const pct = ((activeIdx + 1) / sections.length) * 100;
  return (
    <div style={{
      position: "sticky", top: 64, zIndex: 4,
      background: theme.bg, padding: "10px 16px 12px",
      borderBottom: `1px solid ${theme.line}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: theme.textDim, fontWeight: 600 }}>
          Bagian <span style={{ color: theme.text, fontWeight: 800 }}>{activeIdx + 1}</span> dari {sections.length}
        </span>
        <span style={{ fontSize: 11, color: c, fontWeight: 700, textTransform: "uppercase" }}>
          {sections[activeIdx]?.label}
        </span>
      </div>
      <div style={{ height: 4, background: theme.line, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: c, transition: "width 0.3s" }}/>
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {sections.map((s, i) => (
          <button type="button" key={s.id} onClick={() => onJump?.(i)} style={{
            flexShrink: 0, padding: "7px 12px", borderRadius: 999,
            border: `1px solid ${i === activeIdx ? c : theme.line}`,
            background: i === activeIdx ? c : "transparent",
            color: i === activeIdx ? theme.primaryInk : theme.textDim,
            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            {i < activeIdx && "✓ "}{s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FHChip({ theme, color, children, active, onClick }) {
  const c = color || theme.primary;
  return (
    <button type="button" onClick={onClick} style={{
      height: 36, padding: "0 14px", borderRadius: 999,
      background: active ? c : "transparent",
      border: `1px solid ${active ? c : theme.line}`,
      color: active ? theme.primaryInk : theme.textDim,
      fontSize: 13, fontWeight: 700,
    }}>{children}</button>
  );
}

export function FHCard({ theme, children, padding = 16, accent, style }) {
  return (
    <div style={{
      background: theme.bgCard, border: `1px solid ${theme.line}`,
      borderRadius: 16, padding,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${theme.line}`,
      ...style,
    }}>{children}</div>
  );
}

export function FHModulePill({ theme, moduleKey, size = "md" }) {
  const c = moduleColor(moduleKey, theme);
  const bg = moduleColorSoft(moduleKey, theme);
  const m = FH_MODULES[moduleKey];
  const h = size === "sm" ? 26 : 32;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: h, padding: "0 10px", borderRadius: 8,
      background: bg, color: c, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase",
    }}>
      <FHIcon name={MODULE_ICON[moduleKey]} size={14} stroke={2.5}/>
      {m?.short || moduleKey}
    </span>
  );
}
