// Configured for ESLint 2.12.0
// Designed for >= ES5

'use strict';

module.exports = {
  rules: {
    /*
     * Possible Errors
     */
    'no-cond-assign': ['error', 'always'],
    'no-console': ['error'],
    'no-constant-condition': ['error'],
    'no-debugger': ['error'],
    'no-dupe-args': ['error'],
    'no-dupe-keys': ['error'],
    'no-duplicate-case': ['error'],
    'no-empty': ['error'],
    'no-empty-character-class': ['error'],
    'no-inner-declarations': ['error'],
    'no-invalid-regexp': ['error'],
    'no-irregular-whitespace': ['error'],
    'no-negated-in-lhs': ['error'],
    'no-obj-calls': ['error'],
    'no-prototype-builtins': ['error'],
    'no-regex-spaces': ['error'],
    'no-sparse-arrays': ['error'],
    'no-unexpected-multiline': ['error'],
    'no-unreachable': ['error'],
    'use-isnan': ['error'],
    'valid-typeof': ['error'],

    /*
     * Best Practices
     */
    'accessor-pairs': ['error'],
    'array-callback-return': ['error'],
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'always'],
    'no-alert': ['error'],
    'no-caller': ['error'],
    'no-case-declarations': ['error'],
    'no-div-regex': ['error'],
    'no-empty-pattern': ['error'],
    'no-eval': ['error'],
    'no-extend-native': ['error'],
    'no-fallthrough': ['error'],
    'no-implicit-globals': ['error'],
    'no-implied-eval': ['error'],
    'no-iterator': ['error'],
    'no-loop-func': ['error'],
    'no-multi-str': ['error'],
    'no-native-reassign': ['error'],
    'no-new': ['error'],
    'no-new-func': ['error'],
    'no-new-wrappers': ['error'],
    'no-octal': ['error'],
    'no-octal-escape': ['error'],
    'no-proto': ['error'],
    'no-return-assign': ['error', 'always'],
    'no-script-url': ['error'],
    'no-self-assign': ['error'],
    'no-self-compare': ['error'],
    'no-sequences': ['error'],
    'no-unmodified-loop-condition': ['error'],
    'no-unused-expressions': ['error'],
    'no-with': ['error'],
    'radix': ['error'],

    /*
     * Strict Mode
     */
    'strict': ['error', 'safe'],

    /*
     * Variables
     */
    'no-delete-var': ['error'],
    'no-shadow': ['error', {'builtinGlobals': true, "hoist": "functions"}],
    'no-undef': ['error'],
    'no-unused-vars': ['error'],
    'no-use-before-define': ['error'],

    /*
     * Stylistic Issues
     */
    'brace-style': ['error', '1tbs', {"allowSingleLine": false}],
    'indent': ['error', 2],
    'new-cap': ['error'],
    'semi': ['error', 'always'],

    /*
     * ECMAScript 6
     */
    'constructor-super': ['error'],
    'no-confusing-arrow': ['error'],
    'no-const-assign': ['error'],
    'no-dupe-class-members': ['error'],
    'no-new-symbol': ['error'],
    'no-this-before-super': ['error'],
    'require-yield': ['error'],
  }
};
