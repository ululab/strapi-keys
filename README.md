<p align="center">
  <a href="https://strapi.io/#gh-light-mode-only">
    <img src="https://strapi.io/assets/strapi-logo-dark.svg" width="318px" alt="Strapi logo" />
  </a>
  <a href="https://strapi.io/#gh-dark-mode-only">
    <img src="https://strapi.io/assets/strapi-logo-light.svg" width="318px" alt="Strapi logo" />
  </a>
  
</p>

<h1 align="center"align="center">automatic .env file keys</h1>

<p align="center">
  <h2 align="center">Generate and manage keys quickly, conveniently and securely <br />
  in the .env file of your strapi app</h2>
</p>

<br />

This is a great and convenient way to generate a random string in base64.

This approach is generally secure, as the Node.js cryptographic module is designed to provide secure encryption capabilities.

It uses the `crypto module` of Node.js, which in turn can depend on specific implementations of the operating system, reliable for generating randomness.

`openssl rand -base64 32` uses an operating system random number generator, which is often highly reliable at generating randomness.

[Strapi openssl](https://docs.strapi.io/dev-docs/migration/v4/migration-guide-4.0.6-to-4.1.8#setting-secrets-for-non-development-environments)

## Install with npm:
```bash
npm install @ululab/strapi-keys 
```
## Start to generate keys:


With the command `npm run strapi-keys` to exute alias comand `npm run strapi-keys -- --help`

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
    
    example: `npm run strapi-keys -- --dryrun --refresh`
  - **`--print`** :           Print newly generated variables to the console
  - **`--status`** :          Print the status of keys: check keys

### --status
![image](https://github.com/ululab/strapi-keys/assets/92667330/d74cb077-8c1b-42e8-b7a7-37b2b6662c7d)

## Settings
In the Strapi package.json file add the "strapi-keys" command in the "scripts" field:
```json
{
  "scripts": {
    "strapi-keys": "node node_modules/@ululab/strapi-keys"
  }
}
```

or run the command directly:
```bash
node node_modules/@ululab/strapi-keys
```



## Comand scheduled (working progress)

```js
const { exec } = require('child_process');

const param = '--refresh'; // Sostituisci con il parametro desiderato

exec(`npm run strapi-keys -- ${param}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore: ${error.message}`);
    return;
  }
  console.log(`Output: ${stdout}`);
  console.error(`Errori: ${stderr}`);
});

```


./config/cron-tasks.js
```js
module.exports = {

  refreshKeysEnv: {
    task: ({ strapi }) => {
      // .. execute comand npm run strapi-keys -- --refresh
    },
    options: {
      rule: "0 0 1 */3 *",
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



