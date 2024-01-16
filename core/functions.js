const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const envKeysToGenerate = require("./envKeys");
const optionsCommand = require("./command/list");
const options = require("./command/options");

/**
 * Function to generate keys if they are missing.
 *
 * @param {string|undefined} existingValue - The existing value for the key (if any).
 * @param {string} type - The type of key to generate.
 * @returns {string|null} - The generated key or null if generation failed.
 */
function generateKeyIfMissing(existingValue, type) {
  if (existingValue) {
    return existingValue;
  }

  if (type.startsWith("array")) {
    const [length, innerType] = type.match(/array:(\d+)<(.+)>/).slice(1);
    const innerValues = Array.from({ length: parseInt(length, 10) }, () =>
      generateKeyIfMissing(null, innerType)
    );
    return innerValues.join(",");
  }

  if (type.startsWith("string")) {
    const [length] = type.match(/string:(\d+)/).slice(1);
    return crypto.randomBytes(parseInt(length, 10)).toString("base64");
  }

  return null;
}

/**
 * Check current status current variables keys
 *
 * @param {string|null|undefined} value
 * @param {string} type
 * @returns {boolean}
 */
function checkKeyType(value, type) {
  if (!value) {
    return false;
  }

  if (type.startsWith("array")) {
    let strings = value.split(",");
    return strings.every((str) => checkKeyType(str, 'string'));
  }

  return isBase64(value);
}

/**
 * Tests whether a string is base64 encoded
 *
 * @param {string} str
 * @returns {boolean}
 */
function isBase64(str) {
  try {
      return btoa(atob(str)) === str;
  } catch (e) {
      return false;
  }
}

/**
 * Reads the contents of the file:
 * - .env.example if it exists (in strapi app)
 * - otherwise .env.example (in the strapi app)
 * Returns the contents of the read file.
 *
 * @returns {string}
 */
function readEnvFile() {
  try {
    let content = fs.readFileSync(".env", "utf-8");
    return content ? content : readEnvExampleFile();
  } catch (error) {
    console.error("Error while reading the .env file - ", error.message);
    return readEnvExampleFile();
  }
}

/**
 * Reads the contents of the file:
 * - .env.example if it exists (in strapi app)
 * - otherwise default .env.example (package native)
 * Returns the contents of the read file.
 * 
 * @returns {string}
 */
function readEnvExampleFile() {
  // Prevent if to check status
  if (options.status) {
    return '';
  }

  try {
    return fs.readFileSync(".env.example", "utf-8");
  } catch (error) {
    console.error("Error while reading the .env.example file - ",  error.message);
    return readEnvExampleFileInPkg();
  }
}

/**
 * Contents of the default .env.example file in this package
 * 
 * @returns {string}
 */
function readEnvExampleFileInPkg() {
  const pathEnvExamplePkg = path.resolve(__dirname, './../.env.example');
  try {
    return fs.readFileSync(pathEnvExamplePkg, "utf-8");
  } catch (error) { // Prevent
    console.error("Error while reading the .env.example file in npm package - ",  error.message);
    return ""
  }
}

/**
 * Create a default .env.example file in your strapi app if one doesn't already exist
 * 
 * @returns {boolean|null}
 */
function createEnvExampleIfMissing() {
  if (fileExists(".env.example")) {
    return null;
  }

  try {
    fs.writeFileSync(".env.example", readEnvExampleFileInPkg());
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if the file exists
 * 
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    // Try opening the file in read-only mode
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    // If an error occurs, the file does not exist or is not accessible
    return false;
  }
}

/**
 * Reads and processes the content of the .env file to extract key-value pairs as environment variables.
 *
 * @returns {object} - Object containing key-value pairs of environment variables.
 */
function envVariablesFile() {
  try {
    // Read the content of the .env file
    let content = readEnvFile();

    // Process the content to extract key-value pairs
    let envVariables = content
      .split("\n") // Split the content by lines
      .map((line) => line.trim()) // Remove leading/trailing whitespaces from each line
      .filter((line) => line.length > 0 && !line.startsWith("#")) // Remove empty lines and comments
      .reduce((acc, line) => {
        // Split the line by '=' to separate key and value
        let [key, ...value] = line.split("=");
        acc[key.trim()] = value.join("=").trim(); // Store key-value pair in the object
        return acc;
      }, {}); // Initialize with an empty object

    return envVariables; // Return the extracted environment variables
  } catch (error) {
    console.error("Error while reading the .env file:", error.message); // Log an error if encountered
    return {}; // Return an empty object in case of an error
  }
}

/**
 * Extracts the key prefix from an input string.
 *
 * @param {string} inputString - The input string containing key-value pairs.
 * @returns {string} - The key prefix extracted from the input string.
 */
function extractKeyPrefix(inputString) {
  // Find the index of the '=' sign in the input string
  let equalsIndex = inputString.indexOf("=");

  if (equalsIndex > -1) {
    // If '=' is present, return the substring up to and including '='
    return inputString.slice(0, equalsIndex);
  } else {
    // If '=' is not present, return the original string
    return inputString;
  }
}

/**
 * Gets the value of an existing key from an input string.
 *
 * @param {string} inputString - The input string containing key-value pairs.
 * @returns {string} - The value associated with the key in the input string.
 */
function getExistingKeyValue(inputString) {
  // Find the index of the '=' sign in the input string
  let equalsIndex = inputString.indexOf("=");

  if (equalsIndex > -1) {
    // If '=' is present, return the substring after '='
    return inputString.slice(equalsIndex + 1);
    // Alternatively, you can use substring: return inputString.substring(equalsIndex + 1);
  } else {
    // If '=' is not present, return an empty string or the original string based on requirements
    return "";
  }
}

/**
 * Processes the .env file with generated or updated keys
 * 
 * @returns {string}
 */
function prepareNewContentEnv() {
  // Read the content of the .env file
  let content = readEnvFile();

  // Process the content to update the keys
  content = content
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      line = line.trim();

      // Skip empty lines or lines starting with '#'
      if (!line || line.startsWith("#")) return line;

      // Extract the key name
      let keyName = extractKeyPrefix(line);

      // Find the key in the array of keys to generate
      let findEnvVariable = envKeysToGenerate.find((e) => e.name === keyName);

      if (findEnvVariable) {
        // If the key exists in the array
        if (!getExistingKeyValue(keyName)) {
          // If no existing value for the key, update and mark as processed
          findEnvVariable.processed = true;
          return `${keyName}=${findEnvVariable.value}`;
        } else {
          // If an existing value exists, keep the line unchanged
          return `${line}`;
        }
      } else {
        // If the key is not found in the array, keep the line unchanged
        return line;
      }
    })
    .join("\n")
    .replace(/^[\r\n]+|[\r\n]+$/g, ""); // Trim leading/trailing whitespaces and line breaks

  // Generate content for new keys that were not processed
  const envContent = [
    content,
    envKeysToGenerate
      .filter((e) => !e.processed)
      .map((e) =>
        [
          `\n## ${e.name.replace(/_/g, " ").trim().toUpperCase()}\n`,
          `${e.name}=${e.value}`,
        ].join("")
      )
      .join("\n"),
  ]
    .join("\n")
    .replace(/^[\r\n]+|[\r\n]+$/g, ""); // Trim leading/trailing whitespaces and line breaks

  return envContent;
}

/**
 * Updates the .env file with generated or updated keys
 * 
 * @returns {void}
 */
function writeEnvFile() {
  let envContent = prepareNewContentEnv();
  if (!options.clear && !options.dryrun) {
    // Write the updated content to the .env file
    fs.writeFileSync(".env", envContent);
    // Log a message indicating the keys generated and set in the .env file
    console.log("Generated and set keys in the .env file");
  } else if (options.clear && !options.dryrun) {
    // Write the updated content to the .env file
    fs.writeFileSync(".env", envContent);
    // Log a message indicating the keys have been cleared and setted in the .env file
    console.log("Cleared keys in the .env file");
  } else if (options.dryrun) {
    // Log a message indicating the keys generated but not setted in the .env file
    console.log("\nGenerated keys:");
    printGeneratedEnvVariables();
  }
}

/**
 * Prints the list of available commands with the different options
 * 
 * @returns {void}
 */
function help() {
  console.log(`Usage: npm run strapi-keys -- [options]`);
  console.log(`Options:`);
  optionsCommand.filter(e => !e.withValues).forEach((e) => {
    console.log(`  ${e.value.padEnd(16, " ")} ${e.description}`);
  });
  console.log(`Options with values:`);
  optionsCommand.filter(e => e.withValues).forEach((e) => {
    console.log(`  ${e.value.padEnd(16, " ")} ${e.description}`);
  });
}

/**
 * Check status keys in .env
 * 
 * @returns {void}
 */
function checkStatusKeysEnv() {
  let existingEnvVariables = envVariablesFile();

  let statusKeys = [];

  envKeysToGenerate.forEach((keyConfig) => {
    let currentValue = existingEnvVariables[keyConfig.name];

    let isOk = checkKeyType(currentValue, keyConfig.type);

    statusKeys.push({
      "KEY NAME": keyConfig.name,
      STATUS: isOk ? "success" : "failed",
      OK: isOk,
    });
  });

  console.table(statusKeys, ["KEY NAME", "STATUS", "OK"]);

  if (statusKeys.find((e) => !e.OK)) {
    console.log("KO env key variables");
    console.log(
      'There are some error in the environment key, please run "npm run strapi-keys"'
    );
  } else {
    console.log("OK env key variables");
  }
}

/**
 * Prints the current keys of the .env file
 * 
 * @returns {void}
 */
function printKeyVariablesInEnvFile() {
  let existingEnvVariables = envVariablesFile();
  envKeysToGenerate.forEach((keyConfig) => {
    let currentValue = existingEnvVariables[keyConfig.name];
    console.log(`${keyConfig.name}=${currentValue}`);
  });
}

/**
 * Prints the generated keys
 * 
 * @returns {void}
 */
function printGeneratedEnvVariables() {
  envKeysToGenerate.forEach((e) => {
    console.log(`${e.name}=${e.value}`);
  });
}

module.exports = {
  envVariablesFile,
  generateKeyIfMissing,
  checkKeyType,
  checkStatusKeysEnv,
  printGeneratedEnvVariables,
  printKeyVariablesInEnvFile,
  writeEnvFile,
  createEnvExampleIfMissing,
  help,
};
