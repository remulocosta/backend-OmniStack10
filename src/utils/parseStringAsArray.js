module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(',').map(arrS => arrS.trim());
};
