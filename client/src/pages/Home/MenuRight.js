import { Menu, Button, Icon } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";

const MenuRight = () => {
  const navigate = useNavigate();
  const loc = useLocation();

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
      borderBottom: "1px solid rgba(148,163,184,0.1)",
      marginBottom: "0.5rem",
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
          boxShadow: "0 0 16px rgba(99,102,241,0.5)",
        }}>
          ◆
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700, fontSize: "1.15rem",
          background: "linear-gradient(135deg, #f1f5f9, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
                background: active ? "rgba(99,102,241,0.22)" : "transparent",
                border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent",
                color: active ? "#a5b4fc" : "#cbd5e1",
                padding: "6px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: active ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "rgba(148,163,184,0.12)"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.background = "transparent"; }}}
            >
              <Icon name={link.icon} style={{ margin: 0, fontSize: "0.8rem" }} />
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right side badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{
          background: "rgba(16,185,129,0.15)",
          color: "#34d399",
          border: "1px solid rgba(16,185,129,0.3)",
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
            color: "#cbd5e1",
            textDecoration: "none",
            fontSize: "0.8rem",
            display: "flex", alignItems: "center", gap: 4,
            transition: "color 0.2s",
            fontWeight: 500,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
          onMouseLeave={e => e.currentTarget.style.color = "#cbd5e1"}
        >
          <Icon name="external alternate" style={{ margin: 0 }} />
          API Docs
        </a>
      </div>
    </nav>
  );
};

export default MenuRight;
