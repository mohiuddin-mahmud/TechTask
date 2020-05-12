module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },  
  rules: {
    "linebreak-style": 0,
    "global-require": 0,
     "eslint linebreak-style": [0, "error", "windows"],
    "brace-style": [2, "stroustrup", { "allowSingleLine": true }],
  },
};
