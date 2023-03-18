const JSONToString = dataObj =>
  dataObj
    .map(aspect => {
      return `Aspect: ${aspect.aspect}, Descriptor: ${aspect.description}, Polarity: ${aspect.polarity}`;
    })
    .join("\n\n");

export default JSONToString;
