const path = require('path');

const resolve = (p) => path.resolve(__dirname, p);

const ROOT = 'src';

module.exports = {
  webpack: {
    alias: {
      '@': resolve(ROOT),
    },
  },
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
};
