/**
 * Export HTTPError.
 */
export { default as HTTPError } from './HTTPError';

/**
 * Test if given value is a object or not.
 *
 * @param  {object} obj
 *
 * @return {bool}
 */
export const isObject = (obj: any): boolean =>
  Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Convert camel case to snake case.
 *
 * @param {string} str
 *
 * @return {string}
 */
const toSnakeCase = (str: string): string =>
  str
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + '_' + m[1];
    })
    .toLowerCase();

/**
 * Convert object keys to snake case.
 *
 * @param  {object} obj
 *
 * @return {object}
 */
export const objectKeysToSnakeCase = (
  obj: Record<string, any>
): Record<string, any> =>
  Object.keys(obj).reduce((previous, current) => {
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

/**
 * Flatten array.
 *
 * @param {array} list
 *
 * @return {array}
 */
const flattenArray = (list: any[]): any[] =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []);

/**
 * Encode objects as query strings.
 *
 * @param {object} params
 * @param {string} prefix
 *
 * @return {string}
 */
export const qsEncode = (
  params: Record<string, any>,
  prefix: string = ''
): string => {
  const query = Object.keys(params).map((key) => {
    const isArray = params.constructor === Array;
    const value = isArray ? flattenArray(params)[key] : params[key];

    if (isArray) {
      key = `${prefix}[]`;
    } else if (params.constructor === Object) {
      key = prefix ? `${prefix}[${key}]` : key;
    }

    if (typeof value === 'object') {
      return qsEncode(value, key);
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return [].concat.apply([], query as any).join('&');
};

/**
 * Merge objects deep.
 *
 * @param {object} target
 * @param {object} source
 *
 * @return {object}
 */
export const mergeObjects = (
  target: Record<string, any>,
  source: Record<string, any>
) => {
  if (!isObject(target) && !isObject(source)) {
    return target;
  }

  for (const key in source) {
    if (
      source[key] === null &&
      (target[key] === undefined || target[key] === null)
    ) {
      target[key] = null;
    } else if (source[key] instanceof Array) {
      if (!target[key]) {
        target[key] = [];
      }

      target[key] = target[key].concat(source[key]);
    } else if (isObject(source[key])) {
      if (!isObject(target[key])) {
        target[key] = {};
      }

      mergeObjects(target[key], source[key]);
    } else {
      if (target === undefined) {
        target = {};
      }

      target[key] = source[key];
    }
  }

  return target;
};
