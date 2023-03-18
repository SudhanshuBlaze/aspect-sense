const JSONToString = dataObj =>
  dataObj
    .map(each => {
      return `Aspect: ${each.aspect}, Descriptor: ${each.description}, Polarity: ${each.polarity}`;
    })
    .join("\n\n");

export default JSONToString;
