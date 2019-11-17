import config from '../../rollup.config';
import pkg from './package.json';

export default [
  // CommonJS
  { ...config.cjs(pkg) },
  // ES
  { ...config.es(pkg) },
];
