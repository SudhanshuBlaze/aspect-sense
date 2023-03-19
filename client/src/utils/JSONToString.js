const JSONToString = dataObj =>
  dataObj
    .map(each => {
      return `Aspect: ${each.aspect}, Descriptor: ${each.descriptor}, Polarity: ${each.polarity}`;
    })
    .join("\n\n");

export default JSONToString;
