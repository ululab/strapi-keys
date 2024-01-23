#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const SKIP_IF_EXISTS = false;
const FILE_LOG_PATH = path.join(process.cwd(), './../../strapi-keys.log');;
const PACKAGE_JSON_PATH = path.join(process.cwd(), './../../package.json');
const PACKAGE_JSON_PATH_TEST = path.join(process.cwd(), './../../package-test.json');

/**
 * Description
 * 
 * @param {string} message
 * @returns {void}
 */
function writeLog(message = '') {
  fs.writeFileSync(FILE_LOG_PATH, `${message}\n`, {flag: 'a', encoding: 'utf-8'});
}

/**
 * 
 * @returns {string|bolean}
 */
function readPackageJson() { 

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    writeLog('package.json is not found');
    return false;
  }

  try {
    return fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
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

function mainPostInstall() {
  try {
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(prepareObjectScriptsPkg(), null, 2), 'utf-8');
    console.log('[INFO] strapi-keys: update package.json')
  } catch (error) {
    console.error(error)
    console.log('[WARN] strapi-keys: not updated package.json')
    writeLog('[WARN] strapi-keys: not updated package.json')
  }
}

mainPostInstall();
