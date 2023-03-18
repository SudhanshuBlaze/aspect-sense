const JSONtoString = dataObj =>
  dataObj
    .map(aspect => {
      return `Aspect: ${aspect.aspect}, Descriptor: ${aspect.description}, Polarity: ${aspect.polarity}`;
    })
    .join("\n\n");

export default JSONtoString;
