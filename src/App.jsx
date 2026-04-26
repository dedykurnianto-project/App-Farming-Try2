import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./theme/tokens";

// Pages — forms
import Sanitasi     from "./pages/Sanitasi";
import HPT          from "./pages/HPT";
import Gramasi      from "./pages/Gramasi";
import Vigor        from "./pages/Vigor";
import KesiapanGH   from "./pages/KesiapanGH";
import Penyiraman   from "./pages/Penyiraman";
import SO           from "./pages/SO";
import Penyemprotan from "./pages/Penyemprotan";

// New pages
import Home          from "./pages/Home";
import Sync          from "./pages/Sync";
import SuccessScreen from "./pages/SuccessScreen";

// Components
import FarmhillLogin   from "./components/FarmhillLogin";
import SOPModal, { isMenuSeen } from "./components/SOPModal";
import InstallPWA      from "./components/InstallPWA";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";

import { useAuth } from "./hooks/useAuth";
import { getAll, deleteById } from "./lib/offlineQueue";

const BUILD_ID        = import.meta.env.VITE_APP_BUILD_ID ?? "dev";
const APP_VERSION_KEY = "farmhill_build_id";

const FORM_MAP = {
  so:           SO,
  penyemprotan: Penyemprotan,
  sanitasi:     Sanitasi,
  hpt:          HPT,
  gramasi:      Gramasi,
  penyiraman:   Penyiraman,
  vigor:        Vigor,
  kesiapan:     KesiapanGH,
};

export default function App() {
  const { user, login, logout, isLoggedIn } = useAuth();
  const { theme } = useTheme();

  // screen: "home" | "form" | "sync" | "success"
  const [screen, setScreen]           = useState("home");
  const [activeModule, setActiveModule] = useState(null);
  const [sopMenuKey, setSopMenuKey]   = useState(null);
  const [isOnline, setIsOnline]       = useState(navigator.onLine);
  const [showUpdateNotif, setShowUpdateNotif] = useState(false);
  const [syncQueue, setSyncQueue]     = useState([]);
  const [successData, setSuccessData] = useState(null); // { online: bool }

  // ── Network ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // ── Load sync queue ────────────────────────────────────────────────────────
  const refreshQueue = useCallback(async () => {
    try {
      const items = await getAll();
      // Normalise shape untuk Sync.jsx
      setSyncQueue(items.map(item => ({
        id:        item.id,
        menuKey:   item.menuKey || item.menu || "penyemprotan",
        gh:        item.gh || item.namaGH || "—",
        timestamp: item.queuedAt ? new Date(item.queuedAt).getTime() : Date.now(),
        status:    item.status || "pending",
        error:     item.error || null,
        ...item,
      })));
    } catch {
      setSyncQueue([]);
    }
  }, []);

  useEffect(() => { refreshQueue(); }, [refreshQueue]);
  useEffect(() => { if (isOnline) refreshQueue(); }, [isOnline, refreshQueue]);

  // ── Build-ID update notif ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const saved = localStorage.getItem(APP_VERSION_KEY);
    if (saved !== BUILD_ID) setShowUpdateNotif(true);
  }, [isLoggedIn]);

  // ── SOP on first visit ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const first = Object.keys(FORM_MAP).find(k => user?.[k]?.toUpperCase() === "YES");
    if (first && !isMenuSeen(first)) setSopMenuKey(first);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function pickModule(key) {
    setActiveModule(key);
    setScreen("form");
    if (!isMenuSeen(key)) setSopMenuKey(key);
  }

  function goHome() {
    setScreen("home");
    setActiveModule(null);
    setSuccessData(null);
    refreshQueue();
  }

  function onFormSuccess(data) {
    // data = { online: bool } dipanggil dari form pages via props onSuccess
    setSuccessData(data || { online: isOnline });
    setScreen("success");
    refreshQueue();
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return <FarmhillLogin onLoginSuccess={(userData, remember) => login(userData, remember)} />;
  }

  // ── No access ──────────────────────────────────────────────────────────────
  const hasAccess = Object.keys(FORM_MAP).some(k => user?.[k]?.toUpperCase() === "YES");
  if (!hasAccess) {
    return (
      <div style={{
        minHeight: "100dvh", background: theme.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, padding: "2rem",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <span style={{ fontSize: 40 }}>🔒</span>
        <p style={{ color: theme.textDim, textAlign: "center", fontSize: 14 }}>
          Akun <strong style={{ color: theme.text }}>{user?.nama}</strong> belum memiliki akses modul apapun.
          <br />Hubungi admin untuk pengaturan akses.
        </p>
        <button onClick={logout} style={{
          padding: "10px 24px", borderRadius: 10,
          border: `1px solid ${theme.lineStrong}`, background: "transparent",
          color: theme.textDim, fontSize: 13, cursor: "pointer",
        }}>Logout</button>
      </div>
    );
  }

  const ActiveForm = activeModule ? FORM_MAP[activeModule] : null;

  // ── Offline banner (shared) ────────────────────────────────────────────────
  const OfflineBanner = () => !isOnline ? (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "linear-gradient(135deg, #1565C0, #1976D2)",
      padding: "6px 16px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontSize: 12, color: "#fff", fontWeight: 600,
    }}>
      <span>📵</span>
      <span>Offline — isian tersimpan lokal & dikirim saat online kembali</span>
    </div>
  ) : null;

  return (
    <div style={{ minHeight: "100dvh", background: theme.bg, color: theme.text }}>
      <OfflineBanner />

      {/* ── HOME ── */}
      {screen === "home" && (
        <Home
          user={user}
          onPickModule={pickModule}
          onOpenSync={() => setScreen("sync")}
          onOpenHistory={() => {}}
          onLogout={logout}
          syncQueue={syncQueue.length}
          lastSyncedAgo="baru saja"
        />
      )}

      {/* ── FORM ── */}
      {screen === "form" && ActiveForm && (
        <div style={{ paddingTop: isOnline ? 0 : 30 }}>
          <ActiveForm
            onBack={goHome}
            onSuccess={onFormSuccess}
          />
        </div>
      )}

      {/* ── SYNC ── */}
      {screen === "sync" && (
        <Sync
          queue={syncQueue}
          online={isOnline}
          onBack={goHome}
          onRetry={(item) => {
            // trigger re-flush or mark retry
            console.log("retry", item);
          }}
          onDiscard={async (item) => {
            await deleteById(item.id);
            refreshQueue();
          }}
        />
      )}

      {/* ── SUCCESS ── */}
      {screen === "success" && (
        <SuccessScreen
          menuKey={activeModule || "penyemprotan"}
          gh={successData?.gh || ""}
          queued={!(successData?.online ?? isOnline)}
          onDone={goHome}
          onAnother={() => {
            if (activeModule) pickModule(activeModule);
            else goHome();
          }}
        />
      )}

      {/* ── SOP Modal ── */}
      {sopMenuKey && (
        <SOPModal
          menuKey={sopMenuKey}
          onClose={() => setSopMenuKey(null)}
          onMarkSeen={() => setSopMenuKey(null)}
        />
      )}

      {/* ── Update Notif ── */}
      {showUpdateNotif && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: theme.bgCard, borderRadius: 20, padding: 24, maxWidth: 360, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔔</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: theme.primary, marginBottom: 4 }}>Ada Pembaruan Aplikasi!</div>
              <div style={{ fontSize: 12, color: theme.textDim }}>Ada perubahan sejak terakhir kamu buka</div>
            </div>
            <div style={{ background: theme.bgElev, border: `1px solid ${theme.warn}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: theme.warn, lineHeight: 1.5 }}>
              ⚠️ Aplikasi akan <strong>reload otomatis</strong> untuk menerapkan perubahan terbaru.
            </div>
            <button onClick={() => { localStorage.setItem(APP_VERSION_KEY, BUILD_ID); window.location.reload(); }}
              style={{ width: "100%", padding: 13, border: "none", borderRadius: 12, background: theme.primary, color: theme.primaryInk, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Reload Sekarang 🔄
            </button>
          </div>
        </div>
      )}

      <InstallPWA />
      <PWAUpdatePrompt />
    </div>
  );
}
