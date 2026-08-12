const HeaderDesc = ({ header, description }) => (
  <div style={{ marginBottom: "2.5rem", paddingTop: "0.5rem" }}>
    <h1 style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
      fontWeight: 800,
      color: "#f8fafc",
      letterSpacing: "-0.03em",
      marginBottom: "0.5rem",
      lineHeight: 1.2,
    }}>
      {header}
    </h1>
    {/* Gradient underline accent */}
    <div style={{
      width: 52, height: 3,
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      borderRadius: 4,
      marginBottom: "1rem",
    }} />
    {description && (
      <p style={{
        color: "#cbd5e1",
        fontSize: "1.08rem",
        lineHeight: 1.7,
        maxWidth: 720,
        fontWeight: 400,
      }}>
        {description}
      </p>
    )}
  </div>
);

export default HeaderDesc;
