import React from "react";
import "./AnalyserPipeline.css";
import { Table, Header, Label } from "semantic-ui-react";

const ReviewTable = ({ data }) => {
  if (!data?.reviews || data.reviews.length === 0) return null;

  return (
    <div className="table-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Header as="h3" style={{ margin: 0 }}>
          Scraped & Analyzed Reviews ({data.reviews.length})
        </Header>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table celled striped compactable="true">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "35%" }}>Original Review</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "25%" }}>Segmented Sentences</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>Aspects & Descriptors</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>Aspect Sentiment Polarity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.reviews.map((row, index) => {
              const segmented = Array.isArray(row.segmented_reviews) 
                ? row.segmented_reviews 
                : [row.segmented_reviews];

              const descList = Array.isArray(row.aspect_with_description) 
                ? row.aspect_with_description 
                : [];

              const polList = Array.isArray(row.aspect_with_polarity) 
                ? row.aspect_with_polarity 
                : [];

              return (
                <Table.Row key={index}>
                  <Table.Cell style={{ lineHeight: "1.4" }}>
                    {row.reviews}
                  </Table.Cell>

                  <Table.Cell>
                    {segmented.map((seg, i) => (
                      <div key={i} style={{ marginBottom: "0.25rem", fontSize: "0.85rem", color: "#374151" }}>
                        • {seg}
                      </div>
                    ))}
                  </Table.Cell>

                  <Table.Cell>
                    {descList.length > 0 ? (
                      descList.map((item, i) => (
                        item.aspect && item.description ? (
                          <span key={i} className="aspect-pill desc" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span style={{
                              backgroundColor: "#e0e7ff",
                              color: "#3730a3",
                              fontSize: "0.7rem",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              textTransform: "uppercase"
                            }}>
                              {item.category || "General"}
                            </span>
                            <span>📌 <strong>{item.aspect}</strong>: {item.description}</span>
                          </span>
                        ) : null
                      ))
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>—</span>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    {polList.length > 0 ? (
                      polList.map((item, i) => {
                        if (!item.aspect) return null;
                        const isPos = item.polarity > 0;
                        return (
                          <span 
                            key={i} 
                            className={`aspect-pill ${isPos ? 'positive' : 'negative'}`}
                            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <span style={{
                              backgroundColor: isPos ? "#dcfce7" : "#fee2e2",
                              color: isPos ? "#166534" : "#991b1b",
                              fontSize: "0.7rem",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              textTransform: "uppercase"
                            }}>
                              {item.category || "General"}
                            </span>
                            <span>{isPos ? "👍" : "👎"} <strong>{item.aspect}</strong>: {item.polarity}</span>
                          </span>
                        );
                      })
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>—</span>
                    )}
                  </Table.Cell>

                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ReviewTable;
