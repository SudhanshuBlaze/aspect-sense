import { Icon } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const MenuRight = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { toggleTheme, isDark } = useTheme();

  const links = [
    { label: "Pipeline", path: "/scrapper_pipeline", icon: "database" },
    { label: "ABSA Engine", path: "/single_review", icon: "search" },
  ];

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 0",
      borderBottom: "1px solid var(--as-border)",
      marginBottom: "0.5rem",
      transition: "border-color 0.3s ease",
    }}>
      {/* Brand */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <div style={{
          width: 32, height: 32,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: "#fff",
          boxShadow: "0 0 16px rgba(99,102,241,0.4)",
        }}>
          ◆
        </div>
        <span className="as-gradient-text" style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800, fontSize: "1.2rem",
          letterSpacing: "-0.02em",
        }}>
          AspectSense
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {links.map(link => {
          const active = loc.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: active
                  ? (isDark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.12)")
                  : "transparent",
                border: active
                  ? "1px solid rgba(99,102,241,0.5)"
                  : "1px solid transparent",
                color: active
                  ? (isDark ? "#a5b4fc" : "#4338ca")
                  : (isDark ? "#cbd5e1" : "#475569"),
                padding: "6px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: active ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = isDark ? "#ffffff" : "#0f172a";
                  e.currentTarget.style.background = isDark ? "rgba(148,163,184,0.12)" : "rgba(203,213,225,0.4)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = isDark ? "#cbd5e1" : "#475569";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon name={link.icon} style={{ margin: 0, fontSize: "0.8rem" }} />
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right side controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.12)"}`,
            color: isDark ? "#f1f5f9" : "#0f172a",
            padding: "6px 14px",
            borderRadius: 20,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.borderColor = "var(--as-indigo)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.12)";
          }}
        >
          <span style={{ fontSize: "0.95rem" }}>{isDark ? "☀️" : "🌙"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <span style={{
          background: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.12)",
          color: isDark ? "#34d399" : "#059669",
          border: `1px solid ${isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.25)"}`,
          padding: "4px 12px",
          borderRadius: 20,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}>
          ● Open Source
        </span>

        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          style={{
            color: isDark ? "#cbd5e1" : "#475569",
            textDecoration: "none",
            fontSize: "0.8rem",
            display: "flex", alignItems: "center", gap: 4,
            transition: "color 0.2s",
            fontWeight: 500,
          }}
          onMouseEnter={e => e.currentTarget.style.color = isDark ? "#ffffff" : "#0f172a"}
          onMouseLeave={e => e.currentTarget.style.color = isDark ? "#cbd5e1" : "#475569"}
        >
          <Icon name="external alternate" style={{ margin: 0 }} />
          API Docs
        </a>
      </div>
    </nav>
  );
};

export default MenuRight;
