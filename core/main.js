const envKeysToGenerate = require('./envKeys')
const functions = require('./functions')

/**
 * Handles the process of generating or updating environment keys.
 */
function main() {
  // Get the --force option from the command-line arguments
  console.log(process.argv);
  const forceOptionIndex = process.argv.indexOf('--force');
  const force = forceOptionIndex !== -1;

  // Retrieve existing environment variables from the .env file
  const existingEnvVariables = functions.envVariablesFile();
  
  // Generate or update keys for missing environment variables
  envKeysToGenerate.forEach((keyConfig) => {
    // If the --force option is not set, retrieve existing value for the key; otherwise, use undefined
    let keyValueOrNull = force ? undefined : existingEnvVariables[keyConfig.name];
    
    // Generate a key or update it if missing
    const generatedValue = functions.generateKeyIfMissing(keyValueOrNull, keyConfig.type);
    
    // Update the value for the key in the configuration
    keyConfig.value = generatedValue;
    // Note: existingEnvVariables[keyConfig.name] = generatedValue; could be used to update the existing variables if needed
  });

  // Log the updated keys (for debugging or informational purposes)
  // console.log(envKeysToGenerate); 
  
  // Write the updated keys to the .env file
  functions.writeEnvFile();
  console.log(process.argv);
}


/**
 * node .generate.keys.js
 * npm run strapi-keys --dryrun: simula -> stampare in console
 * npm run strapi-keys --gen o --soft: crea dove manca
 * npm run strapi-keys --upadate o --refresh: crea dove manca e modifica quelle presenti
 * npm run strapi-keys --clear: imposta le chiavi vuote
 * npm run strapi-keys --check : controlla che tuttele chiavi siano correttamente settate
 */
main();


// console.log(envKeysToGenerate)