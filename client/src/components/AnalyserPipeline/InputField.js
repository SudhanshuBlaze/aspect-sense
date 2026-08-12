import React, { useState } from "react";
import "./AnalyserPipeline.css";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { useTheme } from "../../context/ThemeContext";

const InputField = ({
  handleSubmit,
  setLocation,
  location,
  isLoading,
  activeLocations = ["Konark", "Puri", "Daringbadi", "Gopalpur", "Tampara"],
  dbStats = {},
  onAddActiveLocation,
  onRemoveActiveLocation
}) => {
  const [newLocationInput, setNewLocationInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { isDark } = useTheme();

  const handleLocationClick = (loc) => {
    setLocation(loc);
    if (handleSubmit) handleSubmit(null, loc);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    if (onAddActiveLocation) onAddActiveLocation(newLocationInput.trim());
    setNewLocationInput("");
    setShowAddForm(false);
  };

  return (
    <div className="input-card-container">
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Field>
          <label style={{ fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem", color: "var(--as-text-primary)" }}>
            Location or Google Maps URL
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Input
              fluid
              placeholder="e.g. Gopalpur Sea Beach or https://maps.google.com/..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ flex: 1, fontSize: "1rem" }}
              icon="search"
              iconPosition="left"
            />
            <Button
              primary
              loading={isLoading}
              disabled={!location || isLoading}
              type="submit"
              style={{ padding: "0 2.2rem", whiteSpace: "nowrap", fontSize: "0.98rem" }}
            >
              {isLoading ? "Analyzing…" : "⚡ Analyze"}
            </Button>
          </div>
        </Form.Field>
      </Form>

      {/* Active Locations Panel */}
      <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--as-border)", paddingTop: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--as-text-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              📡 Active Scraping Locations
            </span>
            <span style={{ fontSize: "0.85rem", color: isDark ? "#a5b4fc" : "#4338ca", marginLeft: "0.6rem", fontWeight: 600 }}>
              — continuously monitored &amp; saved to DB
            </span>
          </div>
          <button
            style={{
              background: showAddForm ? "rgba(244,63,94,0.12)" : "rgba(99,102,241,0.12)",
              border: `1px solid ${showAddForm ? "rgba(244,63,94,0.3)" : "rgba(99,102,241,0.3)"}`,
              color: showAddForm ? "#fb7185" : (isDark ? "#a5b4fc" : "#4338ca"),
              padding: "6px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Icon name={showAddForm ? "close" : "plus"} style={{ margin: 0 }} />
            {showAddForm ? "Cancel" : "Add Location"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSubmit} style={{ marginBottom: "1rem", display: "flex", gap: 8 }}>
            <input
              placeholder="Enter location name or Google Maps URL…"
              value={newLocationInput}
              onChange={(e) => setNewLocationInput(e.target.value)}
              style={{
                flex: 1,
                background: "var(--as-bg-surface)",
                border: "1px solid var(--as-border)",
                color: "var(--as-text-primary)",
                padding: "9px 16px",
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
            <button type="submit" style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.35)",
              color: isDark ? "#34d399" : "#059669",
              padding: "8px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}>
              ✓ Add
            </button>
          </form>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
          {activeLocations.map((loc) => {
            const locKey = loc.trim();
            const count = dbStats[locKey] || dbStats[locKey.toLowerCase()] || 0;
            const isSelected = location.trim().toLowerCase() === locKey.toLowerCase();
            const isLive = count === 0;

            return (
              <div
                key={loc}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 16px",
                  borderRadius: 20,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background: isSelected
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "var(--as-bg-surface)",
                  color: isSelected ? "#ffffff" : "var(--as-text-secondary)",
                  border: isSelected
                    ? "1px solid rgba(99,102,241,0.5)"
                    : "1px solid var(--as-border)",
                  boxShadow: isSelected ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.color = "var(--as-text-primary)"; }}}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--as-border)"; e.currentTarget.style.color = "var(--as-text-secondary)"; }}}
              >
                <span onClick={() => handleLocationClick(loc)}>
                  📍 {loc}
                </span>
                <span
                  onClick={() => handleLocationClick(loc)}
                  style={{
                    display: "flex", alignItems: "center", gap: 3,
                    background: isSelected ? "rgba(255,255,255,0.2)" : "rgba(148,163,184,0.12)",
                    padding: "1px 7px",
                    borderRadius: 12,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: isSelected ? "#ffffff" : (isLive ? (isDark ? "#34d399" : "#059669") : (isDark ? "#818cf8" : "#4f46e5")),
                  }}
                >
                  {isLive ? (
                    <>
                      <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 4px #10b981",
                        display: "inline-block",
                      }} />
                      Live
                    </>
                  ) : `💾 ${count}`}
                </span>
                {onRemoveActiveLocation && activeLocations.length > 1 && (
                  <Icon
                    name="close"
                    style={{ margin: "0 0 0 2px", opacity: 0.5, cursor: "pointer", fontSize: "0.75rem" }}
                    onClick={(e) => { e.stopPropagation(); onRemoveActiveLocation(loc); }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InputField;
