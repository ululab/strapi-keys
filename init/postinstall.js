#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const FILE_LOG = 'strapi-keys.log';
const SKIP_IF_EXISTS = false;
const packageJsonPath = path.join(process.cwd(), './../../package.json');
const packageJsonPathTest = path.join(process.cwd(), './../../package-test.json');

/**
 * 
 * @param {string} message
 * @returns {void}
 */
function writeLog(message = '') {
  fs.writeFileSync(FILE_LOG, `${message}\n`, { flag: 'a', encoding: 'utf-8'});
}

/**
 * 
 * @returns {string|bolean}
 */
function readPackageJson() { 

  const packageJsonPath = path.join(process.cwd(), './../../package.json');

  // const packageJsonPath = 'package.json';

  if (!fs.existsSync(packageJsonPath)) {
    writeLog('package.json is not found');
    return false;
  }

  try {
    return fs.readFileSync(packageJsonPath, 'utf-8');
  } catch (error) {
    console.error(error);
    writeLog("package.json has not been properly read " + error);
    return false
  }
}

/**
 * 
 * @returns {object}
 */
function prepareObjectScriptsPkg(){

  let contentPkgJson = JSON.parse(readPackageJson());
  
  // In caso di package.json vuoto
  if (!contentPkgJson || typeof contentPkgJson != 'object' || !contentPkgJson.scripts) {
    return  {
      scripts: {
        'strapi-keys': 'strapi-keys'
      }
    }
  }

  // Modifica forzata
  contentPkgJson.scripts['strapi-keys'] = 'strapi-keys'

  return contentPkgJson;
}

try {
  fs.writeFileSync(packageJsonPathTest, JSON.stringify(prepareObjectScriptsPkg(), null, 2), 'utf-8');
  console.log('[INFO] strapi-keys: update package.json')
} catch (error) {
  console.error(error)
  console.log('[WARN] strapi-keys: not updated package.json')
}

console.log(prepareObjectScriptsPkg());

writeLog(process.cwd())

// // Nuovo script da aggiungere
// const newScript = {
//   scripts: {
//     "strapi-keys": "strapi-keys"
//   }
// };

// // Leggi il file package.json
// fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
//   if (err) {
//     console.error(`Errore nella lettura del file package.json: ${err}`);
//     process.exit(1);
//   }

//   // Analizza il contenuto JSON
//   const packageJson = JSON.parse(data);

//   // Aggiungi il nuovo script
//   Object.assign(packageJson, newScript);

//   // Scrivi il file package.json aggiornato
//   fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8', (err) => {
//     if (err) {
//       console.error(`Errore nella scrittura del file package.json: ${err}`);
//       process.exit(1);
//     }

//     console.log('Aggiunta dello script "strapi-keys" completata con successo.');
//   });
// });
