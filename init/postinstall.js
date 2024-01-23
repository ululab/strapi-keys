#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const SKIP_IF_EXISTS = false;
const FILE_LOG_PATH = path.join(process.cwd(), './../../strapi-keys.log');;
const PACKAGE_JSON_PATH = path.join(process.cwd(), './../../package.json');
const PACKAGE_JSON_PATH_TEST = path.join(process.cwd(), './../../package-test.json');

/**
 * Logging file 
 * 
 * @param {string} message
 * @returns {void}
 */
function writeLog(message = '') {
  fs.writeFileSync(FILE_LOG_PATH, `${message}\n`, {flag: 'a', encoding: 'utf-8'});
}

/**
 * Reading package.json file
 * 
 * @returns {string|bolean}
 */
function readPackageJson() { 

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    writeLog('[WARN] package.json is not found');
    return false;
  }

  try {
    return fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
  } catch (error) {
    console.error(error);
    writeLog("[WARN] package.json has not been properly read " + error);
    return false
  }
}

/**
 * Prepare the content to write in package.json
 * 
 * @returns {object}
 */
function prepareObjectScriptsPkg(){

  let contentPkgJson = JSON.parse(readPackageJson());
  
  // If package.json is empty
  if (!contentPkgJson || typeof contentPkgJson != 'object' || !contentPkgJson.scripts) {
    return  {
      scripts: {
        'strapi-keys': 'strapi-keys'
      }
    }
  }

  // Forced change of "stapi-keys" 
  contentPkgJson.scripts['strapi-keys'] = 'strapi-keys'

  return contentPkgJson;
}

/**
 * Add "stapi-keys" in scripting section in package.json file right after installing the package
 * 
 * @returns {void}
 */ 
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
