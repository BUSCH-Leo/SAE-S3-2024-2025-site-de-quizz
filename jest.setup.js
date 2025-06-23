global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});