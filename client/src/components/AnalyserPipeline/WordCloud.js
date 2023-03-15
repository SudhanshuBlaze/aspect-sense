const WordCloud = ({ data }) => {
  return (
    data.negativeCloudImg && (
      <>
        <img src={data.positiveCloudImg} alt="Positive Word Cloud" />
        <img src={data.negativeCloudImg} alt="Negative Word Cloud" />
      </>
    )
  );
};

export default WordCloud;
