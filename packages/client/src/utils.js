/**
 * Test if given value is a object or not.
 *
 * @param  {object} obj
 *
 * @return {bool}
 */
export const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * Convert camel case to snake case.
 *
 * @param {string} str
 *
 * @return {string}
 */
const toSnakeCase = str => {
  return str
    .replace(/[\w]([A-Z])/g, function(m) {
      return m[0] + '_' + m[1];
    })
    .toLowerCase();
};

/**
 * Convert object keys to snake case.
 *
 * @param  {object} obj
 *
 * @return {object}
 */
export const objectKeysToSnakeCase = obj => {
  return Object.keys(obj).reduce((previous, current) => {
    if (isObject(obj[current])) {
      obj[current] = objectKeysToSnakeCase(obj[current]);
    }
    if (obj[current] instanceof Array) {
      previous[toSnakeCase(current)] = obj[current].map(objectKeysToSnakeCase);
    } else {
      previous[toSnakeCase(current)] = obj[current];
    }

    return previous;
  }, {});
};

/**
 * Flatten array.
 *
 * @param {array} list
 *
 * @return {array}
 */
const flattenArray = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []);

/**
 * Covert object to query strings.
 *
 * @param {object} params
 * @param {string} prefix
 *
 * @return {string}
 */
export const queryString = (params, prefix) => {
  const query = Object.keys(params).map(key => {
    const isArray = params.constructor === Array;
    const value = isArray ? flattenArray(params)[key] : params[key];

    if (isArray) {
      key = `${prefix}[]`;
    } else if (params.constructor === Object) {
      key = prefix ? `${prefix}[${key}]` : key;
    }

    if (typeof value === 'object') {
      return queryString(value, key);
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return [].concat.apply([], query).join('&');
};
