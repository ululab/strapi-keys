## 💡Features list💡

**`v1.2.3`**
- ⚙️ Automatically insert the`strapi-keys` script into the package.json file of the strapi-app project after `npm i strapi-keys`  
  🏇 so you can immediately run `npm run strapi-keys -- --generate`

**`v1.2.2`**
- 🎲 Get a single crypto key in base64 (`--rand`)
- 🛠 Generating a **default _.env_** file complete with variables, in the absence of _.env_ or _.env.example_ files
- 🧩 Adding to a **default _.env.example_** file if it does not exist
- 🔏 `--generate` also updates invalid keys, even if they are already set
- 🩺 Improved key quality check (`--status`)

**`v1.2.0`**
- 🎯  Excluding or including specific keys from edit operations with `--exclude` and `--only`
- 📆  Scheduled cron task functionality `require('strapi-keys/core/exec')`

**`v1.0.0`**
- ⏳ Creating .env file based on .env.example if it exists, otherwise it creates or updates it with all the necessary keys
- ⚙️ Updating keys in "soft" and "strict" modes ( `--generate` and `--refresh`)
- 🩺 Checking the status of the keys (`--status`)
- 🔑 Printing new keys in the console (`--print`)
- 🕹 Simulating `--refresh` `--clear` `--generate`  with `--dryrun`

## Advantages
Run `npm install strapi-keys` for:
- ⏳ Save time on setting up your strapi apps (.env and .env.example files)
- 🛠 Automate key creation and management
- 🔑 Safe and ready-to-use keys

🎳Good work!🚀
