import "./AnalyserPipeline.css";
import { Table, Header } from "semantic-ui-react";

const ReviewTable = ({ data }) => {
  return (
    data?.reviews?.length > 0 && (
      <>
        <Header as="h2" style={{ marginTop: 20 }}>
          Reviews
        </Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Review</Table.HeaderCell>
              <Table.HeaderCell>Ratings</Table.HeaderCell>
              <Table.HeaderCell>Segmented Reviews</Table.HeaderCell>
              <Table.HeaderCell>Aspect with Description</Table.HeaderCell>
              <Table.HeaderCell>Aspect with Polarity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.reviews.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>{row.reviews}</Table.Cell>
                <Table.Cell>{row.ratings}</Table.Cell>
                <Table.Cell>[{row.segmented_reviews.toString()}]</Table.Cell>
                <Table.Cell>
                  [{JSON.stringify(row.aspect_with_description)}]
                </Table.Cell>
                <Table.Cell>
                  [{JSON.stringify(row.aspect_with_polarity)}]
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </>
    )
  );
};

export default ReviewTable;
