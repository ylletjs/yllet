import expect from 'expect';
import {
  isObject,
  mergeObjects,
  objectKeysToSnakeCase,
  queryString
} from '../src/utils';

describe('utils.isObject', () => {
  it('can test for objects', () => {
    [
      [true, {}],
      [false, 1],
      [false, false],
      [false, []],
      [false, ''],
      [false, 1.2],
      [false, new Error()]
    ].forEach(d => {
      expect(d[0]).toBe(isObject(d[1]));
    });
  });
});

describe('utils.objectKeysToSnakeCase', () => {
  it('can snake case object keys', () => {
    [
      [
        {
          test_data: 1
        },
        {
          testData: 1
        }
      ],
      [
        {
          test: {
            test_data: 1
          }
        },
        {
          test: {
            testData: 1
          }
        }
      ],
      [
        {
          abc: [
            {
              abc: {
                abc_data: 1
              }
            }
          ]
        },
        {
          abc: [
            {
              abc: {
                abcData: 1
              }
            }
          ]
        }
      ]
    ].forEach(d => {
      const obj = objectKeysToSnakeCase(d[1]);
      expect(d[0]).toEqual(obj);
    });
  });
});

describe('utils.queryString', () => {
  it('convert object to query string', () => {
    [
      [
        {
          a: 100,
          b: 'with spaces',
          c: [1, 2, 3],
          d: { x: 9, y: 8 }
        },
        'a=100&b=with%20spaces&c[]=1&c[]=2&c[]=3&d[x]=9&d[y]=8'
      ],
      [
        {
          foo: 'bar',
          posts: [21, 33, 150]
        },
        'foo=bar&posts[]=21&posts[]=33&posts[]=150'
      ],
      [
        {
          foo: [1, [2], 3],
          bar: ['one', ['two'], 'three']
        },
        'foo[]=1&foo[]=2&foo[]=3&bar[]=one&bar[]=two&bar[]=three'
      ],
      [
        {
          hello: 'world',
          foo: 'bar',
          colors: ['red', 'green', 'blue', 'yellow'],
          numbers: [100, 200, [300]],
          on: true,
          off: false,
          purple: 'haze'
        },
        'hello=world&foo=bar&colors[]=red&colors[]=green&colors[]=blue&colors[]=yellow&numbers[]=100&numbers[]=200&numbers[]=300&on=true&off=false&purple=haze'
      ]
    ].forEach(d => {
      const str = queryString(d[0]);
      expect(str).toEqual(d[1]);
    });
  });
});

describe('utils.queryString', () => {
  it('convert object to query string', () => {
    [
      [
        {
          foo: { bar: 3 },
          array: [
            {
              does: 'work',
              too: [1, 2, 3]
            }
          ]
        },
        {
          foo: { baz: 4 },
          quux: 5,
          array: [
            {
              does: 'work',
              too: [4, 5, 6]
            },
            {
              really: 'yes'
            }
          ]
        },
        {
          foo: {
            bar: 3,
            baz: 4
          },
          array: [
            {
              does: 'work',
              too: [1, 2, 3]
            },
            {
              does: 'work',
              too: [4, 5, 6]
            },
            {
              really: 'yes'
            }
          ],
          quux: 5
        }
      ]
    ].forEach(d => {
      const obj = mergeObjects(d[0], d[1]);
      expect(obj).toEqual(d[2]);
    });
  });
});
