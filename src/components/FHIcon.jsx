// src/components/FHIcon.jsx — line icons monokrom

export default function FHIcon({ name, size = 22, stroke = 2, color = "currentColor", style }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "leaf": return <svg {...props}><path d="M11 20A7 7 0 0 1 4 13c0-4 3-9 11-10 0 8-3 16-11 17Z"/><path d="M11 20c0-4 1-8 5-12"/></svg>;
    case "stock": return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>;
    case "spray": return <svg {...props}><path d="M9 11V4h6v7"/><rect x="7" y="11" width="10" height="9" rx="2"/><path d="M19 5h2M19 8h2M19 11h2"/></svg>;
    case "shield": return <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/></svg>;
    case "bug": return <svg {...props}><rect x="8" y="8" width="8" height="12" rx="4"/><path d="M12 8V5M9 5l-2-2M15 5l2-2M8 12H4M16 12h4M8 16H5M16 16h3"/></svg>;
    case "scale": return <svg {...props}><path d="M12 3v18M5 21h14"/><path d="m6 8 6-2 6 2"/><path d="M3 14a3 3 0 0 0 6 0L6 8Z"/><path d="M15 14a3 3 0 0 0 6 0L18 8Z"/></svg>;
    case "drop": return <svg {...props}><path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/></svg>;
    case "sprout": return <svg {...props}><path d="M12 20v-8"/><path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5Z"/><path d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5Z"/></svg>;
    case "check-circle": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>;
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "chevron-left": return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-up": return <svg {...props}><path d="m6 15 6-6 6 6"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...props}><path d="M5 12h14"/></svg>;
    case "x": return <svg {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
    case "mic": return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case "camera": return <svg {...props}><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case "wifi-off": return <svg {...props}><path d="M2 8.5a14 14 0 0 1 5-2.8M22 8.5a14 14 0 0 0-9-3M5 12.5a9 9 0 0 1 3-2M19 12.5a9 9 0 0 0-5-2.5M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/><path d="m3 3 18 18"/></svg>;
    case "cloud-up": return <svg {...props}><path d="M7 18a4 4 0 0 1-1-7.9A6 6 0 0 1 18 9a4 4 0 0 1 0 8"/><path d="M12 12v8M9 15l3-3 3 3"/></svg>;
    case "menu-grid": return <svg {...props}><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
    case "list": return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "info": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>;
    case "warn": return <svg {...props}><path d="M12 3 2 21h20Z"/><path d="M12 10v5M12 18h.01"/></svg>;
    case "logout": return <svg {...props}><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m15 8 4 4-4 4M19 12H9"/></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "calendar": return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>;
    case "clock": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "qr": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7M14 21h7M17 17h0"/></svg>;
    case "save": return <svg {...props}><path d="M5 3h12l4 4v14H3V3Z"/><path d="M7 3v6h10V3M7 14h10v7H7Z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
