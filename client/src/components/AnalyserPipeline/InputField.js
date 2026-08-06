import React, { useState } from "react";
import "./AnalyserPipeline.css";
import { Button, Form, Input, Icon } from "semantic-ui-react";

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

  const handleLocationClick = (loc) => {
    setLocation(loc);
    if (handleSubmit) {
      handleSubmit(null, loc);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    if (onAddActiveLocation) {
      onAddActiveLocation(newLocationInput.trim());
    }
    setNewLocationInput("");
    setShowAddForm(false);
  };

  return (
    <div className="input-card-container">
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Field>
          <label style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
            Enter Google Maps URL or Location Name
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Input
              fluid
              placeholder="e.g. Gopalpur or https://www.google.com/maps/place/..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ flex: 1 }}
              icon="search"
              iconPosition="left"
            />
            <Button
              primary
              loading={isLoading}
              disabled={!location || isLoading}
              type="submit"
              style={{ padding: "0 2rem" }}
            >
              Analyze
            </Button>
          </div>
        </Form.Field>
      </Form>

      {/* Active Locations Panel */}
      <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1f2937" }}>
              📍 Active Locations
            </span>
            <span style={{ fontSize: "0.8rem", color: "#6b7280", marginLeft: "0.5rem" }}>
              (Continuously scraped & auto-populated into Database)
            </span>
          </div>
          <Button
            size="mini"
            basic
            color="blue"
            icon="plus"
            content={showAddForm ? "Cancel" : "Add Location"}
            onClick={() => setShowAddForm(!showAddForm)}
          />
        </div>

        {showAddForm && (
          <Form onSubmit={handleAddSubmit} style={{ marginBottom: "1rem" }}>
            <Form.Group style={{ display: "flex", gap: "8px", margin: 0 }}>
              <Form.Input
                placeholder="Enter new location or Google Maps URL to monitor..."
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" positive icon="check" content="Add to Active" />
            </Form.Group>
          </Form>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          {activeLocations.map((loc) => {
            const locKey = loc.trim();
            const count = dbStats[locKey] || dbStats[locKey.toLowerCase()] || 0;
            const isSelected = location.trim().toLowerCase() === locKey.toLowerCase();

            return (
              <div
                key={loc}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: isSelected ? "#2563eb" : "#f3f4f6",
                  color: isSelected ? "#ffffff" : "#374151",
                  border: isSelected ? "1px solid #1d4ed8" : "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.15s ease-in-out"
                }}
              >
                <span onClick={() => handleLocationClick(loc)}>
                  📍 {loc}
                </span>
                <span
                  onClick={() => handleLocationClick(loc)}
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "#e5e7eb",
                    color: isSelected ? "#ffffff" : "#4b5563",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}
                >
                  {count > 0 ? `💾 ${count}` : "⚡ Live"}
                </span>
                {onRemoveActiveLocation && activeLocations.length > 1 && (
                  <Icon
                    name="close"
                    style={{
                      margin: "0 0 0 4px",
                      opacity: 0.7,
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveActiveLocation(loc);
                    }}
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
