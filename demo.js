import Client from './packages/yllet/src/index';
import { objectKeysToSnakeCase } from './packages/yllet/src/util';

console.log(objectKeysToSnakeCase({
  abc: {
    abcData: 1
  }
}))
