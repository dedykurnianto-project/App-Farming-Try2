// src/pages/Home.jsx — NEW
// Layar Home baru: greeting, today checklist, FAB modul tersering, grid 8 modul, sync queue card.
// Ekspos onPickModule(key) ke parent (App.jsx) — parent yang handle navigasi tab.

import { useTheme, FH_MODULES, MODULE_ICON, moduleColor, moduleColorSoft } from "../theme/tokens";
import FHIcon from "../components/FHIcon";
import { FHCard, FHModulePill } from "../components/ui";

const HPT_GROUP = ["so", "penyemprotan", "sanitasi", "hpt"];
const SOLO = ["gramasi", "penyiraman", "vigor", "kesiapan"];

// Saran: simpan checklist di Google Sheets per operator/hari, atau hardcode rotasi mingguan.
// Di sini contoh placeholder yang bisa pas dengan data riil:
function todayChecklist(user) {
  return [
    { gh: "Bergas-12", tasks: ["so", "penyiraman"], done: ["so"] },
    { gh: "Tohudan-04", tasks: ["sanitasi", "vigor"], done: [] },
    { gh: "Bergas-08", tasks: ["penyemprotan"], done: [] },
  ];
}

export default function Home({ user, onPickModule, onOpenSync, onOpenHistory, onLogout, syncQueue = 0, lastSyncedAgo = "baru saja" }) {
  const { theme } = useTheme();
  const checklist = todayChecklist(user);
  const totalTasks = checklist.reduce((a, c) => a + c.tasks.length, 0);
  const totalDone = checklist.reduce((a, c) => a + c.done.length, 0);

  // Modul tersering — bisa diambil dari localStorage frequency counter, default Penyemprotan.
  const fabModule = "penyemprotan";

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100dvh", paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: theme.primary, fontWeight: 800, letterSpacing: 1.6 }}>OPERATOR</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", marginTop: 2 }}>
            Selamat pagi, <span style={{ color: theme.primary }}>{user?.nama?.split(" ")[0] || "Operator"}</span>
          </div>
          <div style={{ fontSize: 12, color: theme.textDim, marginTop: 2 }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: 44, height: 44, borderRadius: 12, border: `1px solid ${theme.line}`,
          background: theme.bgElev, color: theme.textDim,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><FHIcon name="logout" size={20}/></button>
      </div>

      {/* Sync queue strip */}
      {syncQueue > 0 ? (
        <button onClick={onOpenSync} style={{
          width: "calc(100% - 32px)", margin: "12px 16px 0",
          background: `color-mix(in oklch, ${theme.warn} 14%, transparent)`,
          border: `1px solid ${theme.warn}`, borderRadius: 14, padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 12, color: theme.text, textAlign: "left",
        }}>
          <FHIcon name="cloud-up" size={22} color={theme.warn}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{syncQueue} data menunggu sync</div>
            <div style={{ fontSize: 11, color: theme.textDim }}>Tap untuk lihat antrian</div>
          </div>
          <FHIcon name="chevron-right" size={20} color={theme.textDim}/>
        </button>
      ) : (
        <div style={{
          margin: "12px 16px 0", padding: "10px 14px", borderRadius: 12,
          background: theme.bgElev, border: `1px solid ${theme.line}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: theme.success }}/>
          <span style={{ fontSize: 12, color: theme.textDim }}>Semua data ter-sync · {lastSyncedAgo}</span>
        </div>
      )}

      {/* Today checklist */}
      <div style={{ padding: "20px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: theme.textDim, letterSpacing: 1.4, textTransform: "uppercase" }}>
          Tugas Hari Ini
        </div>
        <div style={{ fontSize: 12, color: theme.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          {totalDone}/{totalTasks}
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {checklist.map((c, i) => (
          <FHCard key={i} theme={theme} padding={14}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px" }}>{c.gh}</div>
              <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700 }}>
                {c.done.length}/{c.tasks.length}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.tasks.map(t => (
                <span key={t} style={{ opacity: c.done.includes(t) ? 0.45 : 1, textDecoration: c.done.includes(t) ? "line-through" : "none" }}>
                  <FHModulePill theme={theme} moduleKey={t} size="sm"/>
                </span>
              ))}
            </div>
          </FHCard>
        ))}
      </div>

      {/* Modul grid */}
      <div style={{ padding: "20px 16px 6px", fontSize: 12, fontWeight: 800, color: theme.textDim, letterSpacing: 1.4, textTransform: "uppercase" }}>
        Semua Modul
      </div>
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {[...HPT_GROUP, ...SOLO].map(k => {
          const c = moduleColor(k, theme);
          const bg = moduleColorSoft(k, theme);
          return (
            <button key={k} onClick={() => onPickModule?.(k)} style={{
              minHeight: 96, padding: 14, borderRadius: 16,
              background: theme.bgCard, border: `1px solid ${theme.line}`,
              color: theme.text, textAlign: "left",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: bg,
                display: "flex", alignItems: "center", justifyContent: "center", color: c,
              }}>
                <FHIcon name={MODULE_ICON[k]} size={22} stroke={2.2}/>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px" }}>{FH_MODULES[k].label}</div>
                <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>
                  {HPT_GROUP.includes(k) ? "Grup HPT" : "Standalone"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* History link */}
      <button onClick={onOpenHistory} style={{
        width: "calc(100% - 32px)", margin: "16px 16px 0",
        height: 56, borderRadius: 14, background: theme.bgElev,
        border: `1px solid ${theme.line}`, color: theme.text,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FHIcon name="clock" size={20} color={theme.textDim}/>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Riwayat Input Saya</span>
        </div>
        <FHIcon name="chevron-right" size={20} color={theme.textDim}/>
      </button>

      {/* FAB modul tersering */}
      <button onClick={() => onPickModule?.(fabModule)} style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 10,
        height: 64, padding: "0 22px", borderRadius: 32,
        background: theme.primary, color: theme.primaryInk, border: "none",
        boxShadow: "0 12px 30px -8px rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 15, fontWeight: 800, letterSpacing: "-0.1px",
      }}>
        <FHIcon name={MODULE_ICON[fabModule]} size={22} stroke={2.4}/>
        {FH_MODULES[fabModule].label}
      </button>
    </div>
  );
}
