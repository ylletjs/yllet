import expect from 'expect';
import {
  isObject,
  mergeObjects,
  objectKeysToSnakeCase,
  qsEncode
} from '../src';

describe('isObject', () => {
  it('can test for objects', () => {
    [
      [true, {}],
      [false, 1],
      [false, false],
      [false, []],
      [false, ''],
      [false, 1.2],
      [false, new Error()]
    ].forEach((d) => {
      expect(d[0]).toBe(isObject(d[1]));
    });
  });
});

describe('objectKeysToSnakeCase', () => {
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
    ].forEach((d) => {
      const obj = objectKeysToSnakeCase(d[1]);
      expect(d[0]).toEqual(obj);
    });
  });
});

describe('qsEncode', () => {
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
    ].forEach((d) => {
      // @ts-ignore
      const str = qsEncode(d[0]);
      // @ts-ignore
      expect(str).toEqual(d[1]);
    });
  });
});

describe('mergeObjects', () => {
  it('can merge objects', () => {
    [
      [undefined, undefined, undefined],
      [
        {
          foo: null
        },
        {
          foo: null
        },
        {
          foo: null
        }
      ],
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
          ],
          array2: ['bar']
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
          array2: ['bar'],
          quux: 5
        }
      ],
      [
        {
          key1: 'value1',
          key3: 'value3'
        },
        {
          key1: 'changed',
          key2: 'value2'
        },
        {
          key1: 'changed',
          key2: 'value2',
          key3: 'value3'
        }
      ],
      [
        {
          key1: {
            subkey1: 'value1',
            subkey2: 'value2'
          }
        },
        {
          key1: {
            subkey1: 'changed',
            subkey3: 'added'
          }
        },
        {
          key1: {
            subkey1: 'changed',
            subkey2: 'value2',
            subkey3: 'added'
          }
        }
      ],
      [
        {
          key1: 'value1',
          key2: 'value2'
        },
        {
          key1: {
            subkey1: 'subvalue1',
            subkey2: 'subvalue2'
          }
        },
        {
          key1: {
            subkey1: 'subvalue1',
            subkey2: 'subvalue2'
          },
          key2: 'value2'
        }
      ],
      [
        {
          b: {
            c: {}
          }
        },
        {
          a: {}
        },
        {
          a: {},
          b: {
            c: {}
          }
        }
      ],
      [
        {
          a: {
            d: 'bar'
          }
        },
        {
          b: {
            c: 'foo'
          }
        },
        {
          a: {
            d: 'bar'
          },
          b: {
            c: 'foo'
          }
        }
      ],
      [
        {
          key1: {
            subkey1: 'subvalue1',
            subkey2: 'subvalue2'
          },
          key2: 'value2'
        },
        {
          key1: 'value1'
        },
        {
          key1: 'value1',
          key2: 'value2'
        }
      ],
      [
        {
          config: {}
        },
        {
          config: {
            headers: {
              key1: 'value1'
            }
          }
        },
        {
          config: {
            headers: {
              key1: 'value1'
            }
          }
        }
      ]
    ].forEach((d) => {
      // @ts-ignore
      const obj = mergeObjects(d[0], d[1]);
      // @ts-ignore
      expect(obj).toEqual(d[2]);
    });
  });
});
