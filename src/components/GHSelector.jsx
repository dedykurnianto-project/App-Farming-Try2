// src/components/GHSelector.jsx — NEW reusable
// Dipakai di setiap form sebagai langkah pertama. Ganti <select GH> di tiap pages/*.jsx.
//
// Usage di form:
//   import GHSelector from "../components/GHSelector";
//   const [gh, setGh] = useState("");
//   <GHSelector value={gh} onChange={setGh} ghList={ghDataFromHook} accent={moduleColor(...)}/>

import { useState, useEffect } from "react";
import { useTheme } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHCard } from "./ui";

const RECENT_KEY = "farmhill_recent_gh";

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}
function pushRecent(gh) {
  const list = getRecent().filter(x => x !== gh);
  list.unshift(gh);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
}

export default function GHSelector({ value, onChange, ghList = [], accent, onOpenScanner }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  useEffect(() => { setRecent(getRecent()); }, []);

  const c = accent || theme.primary;

  // ghList format: ["Bergas-01", "Bergas-02", ...] atau [{ id: "Bergas-01", area: "Bergas" }]
  const norm = ghList.map(g => typeof g === "string" ? { id: g, area: g.split("-")[0] } : g);
  const filtered = query
    ? norm.filter(g => g.id.toLowerCase().includes(query.toLowerCase()))
    : norm;

  const grouped = filtered.reduce((acc, g) => {
    (acc[g.area] = acc[g.area] || []).push(g);
    return acc;
  }, {});

  const select = (id) => {
    pushRecent(id);
    setRecent(getRecent());
    onChange?.(id);
  };

  if (value) {
    return (
      <FHCard theme={theme} padding={14} accent={c}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Greenhouse Terpilih
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px", color: theme.text, marginTop: 2 }}>
              {value}
            </div>
          </div>
          <button onClick={() => onChange?.("")} style={{
            height: 40, padding: "0 14px", borderRadius: 10,
            background: "transparent", border: `1px solid ${theme.line}`,
            color: theme.textDim, fontSize: 13, fontWeight: 700,
          }}>Ganti</button>
        </div>
      </FHCard>
    );
  }

  return (
    <FHCard theme={theme} padding={14} accent={c}>
      <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
        Pilih Greenhouse
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: theme.inputBg, border: `1.5px solid ${theme.inputBorder}`,
        borderRadius: 12, padding: "0 12px", height: 52, marginBottom: 12,
      }}>
        <FHIcon name="search" size={18} color={theme.textDim}/>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Cari GH (cth. Bergas-12)"
          style={{
            flex: 1, height: "100%", border: "none", background: "transparent",
            outline: "none", color: theme.text, fontSize: 15, fontWeight: 600,
          }}
        />
        {onOpenScanner && (
          <button type="button" onClick={onOpenScanner} style={{
            width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.line}`,
            background: theme.bgElev, color: theme.textDim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><FHIcon name="qr" size={18}/></button>
        )}
      </div>

      {!query && recent.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 700, marginBottom: 6 }}>
            Sering Digunakan
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {recent.map(r => (
              <button key={r} onClick={() => select(r)} style={{
                height: 44, padding: "0 14px", borderRadius: 10,
                background: theme.chipBg, border: `1px solid ${theme.chipBorder}`,
                color: c, fontSize: 14, fontWeight: 700,
              }}>{r}</button>
            ))}
          </div>
        </>
      )}

      {Object.entries(grouped).map(([area, items]) => (
        <div key={area} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 700, marginBottom: 6 }}>
            {area} <span style={{ color: theme.textMute, fontWeight: 500 }}>· {items.length}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {items.map(g => (
              <button key={g.id} onClick={() => select(g.id)} style={{
                height: 56, borderRadius: 10,
                background: theme.bgElev, border: `1px solid ${theme.line}`,
                color: theme.text, fontSize: 14, fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}>{g.id.split("-")[1] || g.id}</button>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ padding: "20px 0", textAlign: "center", color: theme.textMute, fontSize: 13 }}>
          Tidak ada GH cocok dengan "{query}"
        </div>
      )}
    </FHCard>
  );
}
