<p align="center">
    <img src="https://github.com/ululab/strapi-keys/assets/92667330/1109c467-b4ac-46ff-a1f7-838971932dbb" width="80%">
</p>

<h2 align="center"align="center">automatic .env file keys</h2>

<p align="center">
  <h3 align="center">🔐Generate and manage keys quickly, conveniently and securely <br />
  in the .env file of your strapi app 🚀</h3>
</p>

<p align="center">
  
[![npm version](https://badge.fury.io/js/strapi-keys.svg)](https://www.npmjs.com/package/strapi-keys)

</p>   

`$ npm run strapi-keys -- --refresh `

![key-v2](https://github.com/ululab/strapi-keys/assets/92667330/11de6487-ba16-496b-a049-2395e5e51f54)

This is a great and convenient way to generate a random string in base64.

This approach is generally secure, as the Node.js cryptographic module is designed to provide secure encryption capabilities.

It uses the `crypto module` of Node.js, which in turn can depend on specific implementations of the operating system, reliable for generating randomness.

`openssl rand -base64 32` uses an operating system random number generator, which is often highly reliable at generating randomness.

[Strapi openssl](https://docs.strapi.io/dev-docs/migration/v4/migration-guide-4.0.6-to-4.1.8#setting-secrets-for-non-development-environments)

## Install with npm:
```bash
npm i strapi-keys 
```
## Start to generate keys:


With the command `npm run strapi-keys` to exute alias comand `npm run strapi-keys -- --help`

⏳ Creating .env file based on .env.example if it exists, otherwise it creates or updates it with all the necessary keys  

```bash
npm run strapi-keys -- --generate
```

```env
############################
## BEFORE 
############################
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
APP_KEYS=

############################
## AFTER
############################
API_TOKEN_SALT=28LCPMgoHb/g3Dc5oIYwGo54WGDSknbQzuDZjPmmhA==
ADMIN_JWT_SECRET=7dLaf0Aaw0mGUTrSPQSnj/tK9VdMSxPxhUxfIb36SA==
TRANSFER_TOKEN_SALT=PgmIoztGd+V39JhTttjZ918T5znZpsuzfaEh5AemCA==
JWT_SECRET=Kqps5CJSStj9AifWPSyA1Cm2upo1WagjAxGHr5WRqQ==
APP_KEYS=Zmm6D18zm3io82ZuSVmkLlrNjQ==,pNRI6xlBjSWcuTIDr2zv1hL1fA==,DwW/7JnK6dFPeo9FIke6tsBx9g==,pINKR6f05Mxx8/fsECTnjAKAMg==
```

### List command options:
```npm
npm run strapi-keys -- --help
```

Usage: npm run strapi-keys -- [options]

Options:
  - **`--help`** :           List all available commands
  - **`--refresh`** :        Forcefully overwrite all keys
  - **`--generate`** :        Generate keys where missing
  - **`--clear`** :           Clear values of keys
  - **`--dryrun`** :          Print involved variables based on the launched command  
  example:
    ```npm
     npm run strapi-keys -- --dryrun --refresh
    ```
   - **`--print`** :           Print newly generated variables to the console
   - **`--status`** :          Print the status of keys: check keys
   - **`--rand`** :  Print a single crypto key in base64           
    
Options with values:
- **`--exclude=`** :       Exclude certain keys from the changes operations  
  example:  
    ```npm
  npm run strapi-keys -- --refresh --exclude=JWT_SECRET
    ```
- **`--only=`** :       Include only certain keys in changes operations
> Separate multiple values with a comma (`,`)

### --status
![image](https://github.com/ululab/strapi-keys/assets/92667330/c06f8a2c-dede-4f76-bc74-89d78f51c1fb)


## Settings
In the Strapi package.json file add the "strapi-keys" command in the "scripts" field:
```json
{
  "scripts": {
    "strapi-keys": "strapi-keys"
  }
}
```

or run the command directly:
```bash
node node_modules/strapi-keys
```



## Comand scheduled
./config/cron-tasks.js
```js
module.exports = {

  refreshKeysEnv: {
    task: ({ strapi }) => {
      const keysExec = require('strapi-keys/core/exec');
      keysExec('--refresh --exclude=JWT_SECRET')
    },
    options: {
      rule: "0 0 1 */2 * *",
    },
  },

};
```
./config/server.js
```js
const cronTask = require("./cron-tasks")

module.exports = ({ env }) => ({
  cron: {
    enabled: env.bool('CRON_ENABLED', false),
    tasks: cronTask,
  }
});

```
Set the variable in the .env file
```env
CRON_ENABLED=true
```

This functionality is supported and documented in:
- [Cron-style Scheduling](https://www.npmjs.com/package/node-schedule)
- [Strapi cron configuration](https://docs.strapi.io/dev-docs/configurations/cron)


