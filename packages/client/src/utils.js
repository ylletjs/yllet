import toSnakeCase from 'to-snake-case';

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
