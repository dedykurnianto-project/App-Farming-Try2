// src/theme/tokens.js
// 3 themes — pilih via THEME_KEY (env atau localStorage)
// Forest = dark green Farmhill refined
// Daylight = light untuk siang silau
// Utility = amber-on-black industrial

export const FH_THEMES = {
  forest: {
    name: "Forest",
    bg: "#0B1A12", bgElev: "#10241A", bgCard: "#15301F",
    line: "rgba(255,255,255,0.08)", lineStrong: "rgba(255,255,255,0.16)",
    text: "#F2F7F1", textDim: "rgba(242,247,241,0.62)", textMute: "rgba(242,247,241,0.36)",
    primary: "#5BC47A", primaryDeep: "#2D7A4A", primaryInk: "#0B1A12",
    chipBg: "rgba(91,196,122,0.12)", chipBorder: "rgba(91,196,122,0.28)",
    danger: "#FF6B6B", warn: "#FFB84D", info: "#5DB4FF", success: "#5BC47A",
    inputBg: "rgba(255,255,255,0.04)", inputBorder: "rgba(255,255,255,0.12)",
  },
  daylight: {
    name: "Daylight",
    bg: "#F4F2EB", bgElev: "#FFFFFF", bgCard: "#FFFFFF",
    line: "rgba(15,40,25,0.10)", lineStrong: "rgba(15,40,25,0.22)",
    text: "#0F2819", textDim: "rgba(15,40,25,0.62)", textMute: "rgba(15,40,25,0.40)",
    primary: "#1F6B3A", primaryDeep: "#11502A", primaryInk: "#FFFFFF",
    chipBg: "rgba(31,107,58,0.10)", chipBorder: "rgba(31,107,58,0.28)",
    danger: "#C5322B", warn: "#B26800", info: "#1565C0", success: "#1F6B3A",
    inputBg: "#FBFAF5", inputBorder: "rgba(15,40,25,0.14)",
  },
  utility: {
    name: "Utility",
    bg: "#0E0E10", bgElev: "#181A1D", bgCard: "#1F2226",
    line: "rgba(255,255,255,0.10)", lineStrong: "rgba(255,255,255,0.20)",
    text: "#FFFFFF", textDim: "rgba(255,255,255,0.65)", textMute: "rgba(255,255,255,0.40)",
    primary: "#FFCB1F", primaryDeep: "#E5B100", primaryInk: "#101010",
    chipBg: "rgba(255,203,31,0.14)", chipBorder: "rgba(255,203,31,0.40)",
    danger: "#FF4D4F", warn: "#FFCB1F", info: "#56C4FF", success: "#7DD86F",
    inputBg: "#101115", inputBorder: "rgba(255,255,255,0.18)",
  },
};

export const FH_MODULES = {
  so:           { label: "Stock Opname",  short: "SO",       hue: 22  },
  penyemprotan: { label: "Penyemprotan",  short: "Spray",    hue: 220 },
  sanitasi:     { label: "Sanitasi",      short: "Sanitasi", hue: 180 },
  hpt:          { label: "HPT",           short: "HPT",      hue: 0   },
  gramasi:      { label: "Gramasi",       short: "Gramasi",  hue: 260 },
  penyiraman:   { label: "Penyiraman",    short: "Air",      hue: 200 },
  vigor:        { label: "Vigor",         short: "Vigor",    hue: 140 },
  kesiapan:     { label: "Kesiapan GH",   short: "Kesiapan", hue: 160 },
};

export function moduleColor(key, theme) {
  const m = FH_MODULES[key];
  if (!m) return theme.primary;
  return theme.name === "Daylight"
    ? `oklch(0.50 0.13 ${m.hue})`
    : `oklch(0.74 0.13 ${m.hue})`;
}

export function moduleColorSoft(key, theme) {
  const m = FH_MODULES[key];
  if (!m) return theme.chipBg;
  return theme.name === "Daylight"
    ? `oklch(0.94 0.04 ${m.hue})`
    : `oklch(0.30 0.06 ${m.hue})`;
}

export const MODULE_ICON = {
  so: "stock", penyemprotan: "spray", sanitasi: "shield", hpt: "bug",
  gramasi: "scale", penyiraman: "drop", vigor: "sprout", kesiapan: "check-circle",
};

// ── Theme provider ────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from "react";

const ThemeCtx = createContext(FH_THEMES.forest);

const STORAGE_KEY = "farmhill_theme";

export function ThemeProvider({ children, defaultTheme = "forest" }) {
  const [key, setKey] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || defaultTheme; }
    catch { return defaultTheme; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, key); } catch {}
    document.body.style.background = (FH_THEMES[key] || FH_THEMES.forest).bg;
  }, [key]);
  const theme = FH_THEMES[key] || FH_THEMES.forest;
  return (
    <ThemeCtx.Provider value={{ theme, themeKey: key, setThemeKey: setKey }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
