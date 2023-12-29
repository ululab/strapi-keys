/**
 * Array of environment keys to generate or update
 *
 * @type {Array<{name: string, type: string, value: string|null, processed: boolean}>}
 */
module.exports = [
  {
    name: "APP_KEYS",
    type: "array:4<string:19>",
    value: null,
    processed: false,
  },
  { name: "API_TOKEN_SALT", 
    type: "string:31", 
    value: null, 
    processed: false 
  },
  {
    name: "ADMIN_JWT_SECRET",
    type: "string:31",
    value: null,
    processed: false,
  },
  {
    name: "TRANSFER_TOKEN_SALT",
    type: "string:31",
    value: null,
    processed: false,
  },
  { name: "JWT_SECRET", 
    type: "string:31", 
    value: null, 
    processed: false 
  },
];
