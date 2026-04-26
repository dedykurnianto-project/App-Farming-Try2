// src/pages/Sync.jsx — NEW
// Halaman antrian sync. Read offlineQueue dari useOfflineQueue() existing hook.
// Replace import path sesuai project Anda.

import { useTheme, FH_MODULES, MODULE_ICON, moduleColor } from "../theme/tokens";
import FHIcon from "../components/FHIcon";
import { FHCard, FHButton, FHModulePill } from "../components/ui";

export default function Sync({ queue = [], onBack, onRetry, onDiscard, online = true }) {
  const { theme } = useTheme();

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100dvh" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 5, background: theme.bg,
        borderBottom: `1px solid ${theme.line}`, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 44, height: 44, borderRadius: 12, border: `1px solid ${theme.line}`,
          background: theme.bgElev, color: theme.text,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><FHIcon name="chevron-left" size={22}/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.primary, fontWeight: 800, letterSpacing: 1.4 }}>SYNC QUEUE</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>Antrian Data</div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Status banner */}
        <div style={{
          padding: "12px 14px", borderRadius: 12, marginBottom: 16,
          background: online
            ? `color-mix(in oklch, ${theme.success} 12%, transparent)`
            : `color-mix(in oklch, ${theme.warn} 12%, transparent)`,
          border: `1px solid ${online ? theme.success : theme.warn}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <FHIcon name={online ? "cloud-up" : "wifi-off"} size={20} color={online ? theme.success : theme.warn}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {online ? "Online — sync otomatis berjalan" : "Offline — data tersimpan lokal"}
            </div>
            <div style={{ fontSize: 11, color: theme.textDim }}>
              {queue.length} menunggu · {online ? "biasanya selesai dalam beberapa detik" : "akan terkirim begitu sinyal kembali"}
            </div>
          </div>
        </div>

        {queue.length === 0 ? (
          <div style={{
            padding: "60px 20px", textAlign: "center", borderRadius: 16,
            background: theme.bgCard, border: `1px solid ${theme.line}`,
          }}>
            <FHIcon name="check-circle" size={48} color={theme.success}/>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>Semua tersinkron</div>
            <div style={{ fontSize: 13, color: theme.textDim, marginTop: 4 }}>
              Tidak ada data yang menunggu di antrian.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {queue.map((item, i) => {
              const c = moduleColor(item.menuKey, theme);
              return (
                <FHCard key={item.id || i} theme={theme} padding={14} accent={c}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <FHModulePill theme={theme} moduleKey={item.menuKey} size="sm"/>
                      <div style={{ fontSize: 16, fontWeight: 800, marginTop: 6, letterSpacing: "-0.2px" }}>
                        {item.gh || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: theme.textDim, marginTop: 2 }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString("id-ID") : ""}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 6, letterSpacing: 0.8,
                      background: item.status === "error" ? `color-mix(in oklch, ${theme.danger} 16%, transparent)` : theme.chipBg,
                      color: item.status === "error" ? theme.danger : c,
                      textTransform: "uppercase",
                    }}>{item.status || "menunggu"}</span>
                  </div>

                  {item.error && (
                    <div style={{ fontSize: 12, color: theme.danger, marginBottom: 8 }}>{item.error}</div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <FHButton theme={theme} size="sm" variant="secondary" onClick={() => onRetry?.(item)}>Coba Lagi</FHButton>
                    <FHButton theme={theme} size="sm" variant="ghost" onClick={() => onDiscard?.(item)}>Buang</FHButton>
                  </div>
                </FHCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
