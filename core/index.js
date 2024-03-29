const envKeysToGenerate = require("./envKeys");

const functions = require("./functions");

const options = require("./command/options");

/**
 * Handles the process of generating or updating environment keys.
 * 
 * @returns {void}
 */
function main() {
  /**
   * If --help command is called shows the help message
   */
  if (options.help) {
    functions.help();
    return;
  }

  /**
   * If --status command is called the function will check the status of the keys
   */
  if (options.status) {
    functions.checkStatusKeysEnv();
    return;
  }

  /**
   * If --dryrun command is called the function will print out the status of the keys before running and after running
   */
  if (options.dryrun) {
    console.log("Old keys:");
    functions.printKeyVariablesInEnvFile();
  }

  // Retrieve existing environment variables from the .env file
  const existingEnvVariables = functions.envVariablesFile();

  // Generate or update keys for missing environment variables
  envKeysToGenerate.forEach((keyConfig) => {
    /**
     * If the --refresh or --print option is not set, retrieve existing value for the key if valid; 
     * otherwise, use undefined.
     * In case of exclusion, the original value is maintained
     */
    let keyValueOrNull =
      (options.refresh || options.print || 
      (options.generate && !functions.checkKeyType(existingEnvVariables[keyConfig.name], keyConfig.type))) &&
      !options.exclude.includes(keyConfig.name)
        ? undefined
        : existingEnvVariables[keyConfig.name];

    // If the --only is enabled, that or those key values -> undefined
    if (options.only.length > 0) {
      keyValueOrNull = options.only.includes(keyConfig.name)
        ? undefined
        : existingEnvVariables[keyConfig.name];
    }
    
    // Generate a key or update it if missing
    const generatedValue = options.clear
        ? ""
        : functions.generateKeyIfMissing(keyValueOrNull, keyConfig.type);

    // Update the value for the key in the configuration
    keyConfig.value = generatedValue;
    // Note: existingEnvVariables[keyConfig.name] = generatedValue; could be used to update the existing variables if needed
  });

  // Log the updated keys (for debugging or informational purposes)
  // console.log(envKeysToGenerate);

  // If the --print option is set, print out the generated keys (it will not set them into .env file)
  if (options.print) {
    functions.printGeneratedEnvVariables();
  }

  // Write the updated keys to the .env file
  if (options.refresh || options.generate || options.clear) {
    functions.writeEnvFile();
  }

  // If --print a random key
  if (options.rand) {
    let randKey = functions.generateKeyIfMissing(undefined, 'string:31');
    console.log(randKey)
  }

  // Create the .env.example file if run generate or refresh
  if (!options.dryrun && (options.generate || options.refresh)) {
    functions.createEnvExampleIfMissing()
  }
}

module.exports = main;
