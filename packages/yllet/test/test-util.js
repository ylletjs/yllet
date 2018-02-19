import test from 'ava';
import { isObject, objectKeysToSnakeCase } from '../src/util';

test('isObject', t => {
  const data = [
    [true, {}],
    [false, 1],
    [false, false],
    [false, []],
    [false, ''],
    [false, 1.2],
    [false, new Error]
  ].forEach(d => {
    t.is(d[0], isObject(d[1]));
  });
});

test('objectKeysToSnakeCase', t => {
  const data = [
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
    t.deepEqual(d[0], obj);
  });
});
