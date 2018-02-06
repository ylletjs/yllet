import toSnakeCase from 'to-snake-case';

/**
 * Test if given value is a object or not.
 *
 * @param  {object} obj
 *
 * @return {bool}
 */
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * Convert object keys to snake case.
 *
 * @param  {object} obj
 *
 * @return {object}
 */
export function objectKeysToSnakeCase(obj) {
  return Object.keys(obj).reduce((previous, current) => {
    previous[toSnakeCase(current)] = obj[current];
    return previous;
  }, {});
}
