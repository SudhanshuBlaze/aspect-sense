import "./AnalyserPipeline.css";

const ReviewTable = ({ data }) => {
  return (
    data?.reviews?.length > 0 && (
      <table>
        <thead>
          <tr>
            <th>Review</th>
            <th>Ratings</th>
            <th>Segmented Reviews</th>
            <th>Aspect with Description</th>
            <th>Aspect with Polarity</th>
          </tr>
        </thead>
        <tbody>
          {data?.reviews.map((row, index) => (
            <tr key={index}>
              <td>{row.reviews}</td>
              <td>{row.ratings}</td>
              <td>[{row.segmented_reviews.toString()}]</td>

              <td>[{JSON.stringify(row.aspect_with_description)}]</td>
              <td>[{JSON.stringify(row.aspect_with_polarity)}]</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

export default ReviewTable;
