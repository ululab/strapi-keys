# strapi-keys
Genarete keys file .env

```bash
npm run strapi-keys 
```
or
```bash
npm run strapi-keys -- --generate
```

List command options:
```npm
npm run strapi-keys -- --help
npm run strapi-keys -- --generate
npm run strapi-keys -- --refresh
npm run strapi-keys -- --clear
npm run strapi-keys -- --print
npm run strapi-keys -- --status
npm run strapi-keys -- --dryrun
```


In package.json file in Strapi:
```json
{
  "scripts": {
    "strapi-keys": "node node_modules/@ululab/strapi-keys"
  }
}
```

or exute command
```bash
node node_modules/@ululab/strapi-keys
```


```env
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
APP_KEYS=
```

```env
API_TOKEN_SALT=28LCPMgoHb/g3Dc5oIYwGo54WGDSknbQzuDZjPmmhA==
ADMIN_JWT_SECRET=7dLaf0Aaw0mGUTrSPQSnj/tK9VdMSxPxhUxfIb36SA==
TRANSFER_TOKEN_SALT=PgmIoztGd+V39JhTttjZ918T5znZpsuzfaEh5AemCA==
JWT_SECRET=Kqps5CJSStj9AifWPSyA1Cm2upo1WagjAxGHr5WRqQ==
APP_KEYS=Zmm6D18zm3io82ZuSVmkLlrNjQ==,pNRI6xlBjSWcuTIDr2zv1hL1fA==,DwW/7JnK6dFPeo9FIke6tsBx9g==,pINKR6f05Mxx8/fsECTnjAKAMg==
```


# Comand scheduled

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
