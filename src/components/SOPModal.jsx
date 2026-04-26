// src/components/SOPModal.jsx — REPLACE
// Logic markMenuSeen / SOP[menuKey] tetap dari versi asli.

const STORAGE_KEY = "farmhill_sop_seen";

function getSeenMenus() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function markMenuSeen(menuKey) {
  const seen = getSeenMenus();
  seen[menuKey] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
}

export function isMenuSeen(menuKey) { return !!getSeenMenus()[menuKey]; }
export function resetAllSeen() { localStorage.removeItem(STORAGE_KEY); }

import { useTheme, FH_MODULES, MODULE_ICON, moduleColor, moduleColorSoft } from "../theme/tokens";
import FHIcon from "./FHIcon";
import { FHButton } from "./ui";
import SOP from "../data/sopContent"; // keep existing data

export default function SOPModal({ menuKey, onClose, onMarkSeen }) {
  const { theme } = useTheme();
  const sop = SOP[menuKey];
  if (!sop) return null;
  const c = moduleColor(menuKey, theme);
  const bg = moduleColorSoft(menuKey, theme);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 520, maxHeight: "90dvh", overflowY: "auto",
        background: theme.bg, borderRadius: "20px 20px 0 0",
        border: `1px solid ${theme.line}`, borderBottom: "none",
      }}>
        {/* Drag handle */}
        <div style={{ padding: "10px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: theme.lineStrong }}/>
        </div>

        {/* Header */}
        <div style={{ padding: "8px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: bg,
            display: "flex", alignItems: "center", justifyContent: "center", color: c,
          }}>
            <FHIcon name={MODULE_ICON[menuKey]} size={28} stroke={2.2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: c, fontWeight: 800, letterSpacing: 1.4 }}>PANDUAN · SOP</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", color: theme.text, marginTop: 2 }}>
              {sop.title}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 40, height: 40, borderRadius: 10, border: `1px solid ${theme.line}`,
            background: theme.bgElev, color: theme.textDim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><FHIcon name="x" size={20}/></button>
        </div>

        <div style={{ padding: "0 20px 8px", color: theme.textDim, fontSize: 14, lineHeight: 1.5 }}>
          {sop.description}
        </div>

        {/* Steps */}
        <div style={{ padding: "16px 20px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          {sop.steps?.map(s => (
            <div key={s.step} style={{
              display: "flex", gap: 12, padding: 12, borderRadius: 12,
              background: theme.bgCard, border: `1px solid ${theme.line}`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: bg, color: c,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, flexShrink: 0,
              }}>{s.step}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>{s.title}</div>
                <div style={{ fontSize: 13, color: theme.textDim, lineHeight: 1.5, marginTop: 2 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {sop.notes?.length > 0 && (
          <div style={{ padding: "8px 20px 8px" }}>
            <div style={{ fontSize: 11, color: theme.warn, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
              Penting Diingat
            </div>
            <div style={{
              padding: 14, borderRadius: 12,
              background: `color-mix(in oklch, ${theme.warn} 8%, transparent)`,
              border: `1px solid ${theme.warn}`,
            }}>
              {sop.notes.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < sop.notes.length - 1 ? 8 : 0 }}>
                  <FHIcon name="warn" size={16} color={theme.warn} style={{ marginTop: 2, flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          position: "sticky", bottom: 0, padding: "16px 20px 24px",
          background: theme.bg, borderTop: `1px solid ${theme.line}`,
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <FHButton theme={theme} full color={c} onClick={() => { markMenuSeen(menuKey); onMarkSeen?.(); onClose?.(); }}>
            Saya mengerti — Mulai
          </FHButton>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", color: theme.textDim,
            fontSize: 13, fontWeight: 600, padding: "8px 0",
          }}>Tutup tanpa tandai</button>
        </div>
      </div>
    </div>
  );
}
