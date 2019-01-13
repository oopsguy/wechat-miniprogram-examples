function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function parseInteger(val) {
  if (isNaN(val))
    return 0;
  return parseInt(val);
}

module.exports = {
  isFunction: isFunction,
  parseInteger: parseInt
}