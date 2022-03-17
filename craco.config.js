/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const resolve = (p) => path.resolve(__dirname, p);

const ROOT = 'src';

module.exports = {
  webpack: {
    alias: {
      '@': resolve(ROOT),
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console'],
      }),
    ],
  },
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
};
