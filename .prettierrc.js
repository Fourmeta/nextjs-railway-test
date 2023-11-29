/** @type {import("prettier").Config} */
module.exports = {
  ...require('prettier-config'),
  importOrder: [
    '^react(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/core',
    '^@/core/(.*)$',
    '^@/modules',
    '^@/modules/(.*)$',
    '^@/conversation',
    '^@/conversation/(.*)$',
    '^[./]',
  ],
};
