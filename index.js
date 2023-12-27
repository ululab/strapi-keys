const fs = require('fs');
const crypto = require('crypto');

const envKeysToGenerate = [
  { name: 'APP_KEYS', type: 'array:4<string:17>', value: null, processed: false },
  { name: 'API_TOKEN_SALT', type: 'string:31', value: null, processed: false },
  { name: 'ADMIN_JWT_SECRET', type: 'string:31', value: null, processed: false },
  { name: 'TRANSFER_TOKEN_SALT', type: 'string:31', value: null, processed: false },
  { name: 'JWT_SECRET', type: 'string:31', value: null, processed: false },
];

function generateKeyIfMissing(existingValue, type) {
  if (existingValue) {
    return existingValue;
  }

  if (type.startsWith('array')) {
    const [length, innerType] = type.match(/array:(\d+)<(.+)>/).slice(1);
    const innerValues = Array.from({ length: parseInt(length, 10) }, () => generateKeyIfMissing(null, innerType));
    return innerValues.join(',');
  }

  if (type.startsWith('string')) {
    const [length] = type.match(/string:(\d+)/).slice(1);
    return crypto.randomBytes(parseInt(length, 10)).toString('base64');
  }

  return null;
}


function readEnvFile() {
  try {
    return fs.readFileSync('.env', 'utf-8');
  } catch (error) {
    console.error('Errore durante la lettura del file .env:', error.message);
    return readEnvExampleFile();
    return {};
  }
}

function readEnvExampleFile() {
  try {
    return fs.readFileSync('.env.example', 'utf-8');
  } catch (error) {
    console.error('Errore durante la lettura del file .env.example:', error.message);
    return {};
  }
}

function envVariablesFile() {
  try {
    let content = readEnvFile();
    let envVariables = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .reduce((acc, line) => {
        let [key, ...value] = line.split('=');
        acc[key.trim()] = value.join('=').trim();
        return acc;
      }, {});

    return envVariables;
  } catch (error) {
    console.error('Errore durante la lettura del file .env:', error.message);
    return {};
  }
}

function extractKeyPrefix(inputString) {
  let equalsIndex = inputString.indexOf('=');

  if (equalsIndex > -1) {
    // Se '=' è presente, restituisci la sottostringa fino a '=' incluso
    return inputString.slice(0, equalsIndex);
  } else {
    // Se '=' non è presente, restituisci la stringa originale
    return inputString;
  }
}

function getExistingKeyValue(inputString) {
  let equalsIndex = inputString.indexOf('=');

  if (equalsIndex > -1) {
    // Se '=' è presente, restituisci la sottostringa dopo '='
    return inputString.slice(equalsIndex + 1);
    // Oppure puoi usare substring: return inputString.substring(equalsIndex + 1);
  } else {
    // Se '=' non è presente, restituisci una stringa vuota o la stringa originale a seconda delle tue esigenze
    return '';
  }
}

function writeEnvFile() {
    let content = readEnvFile();
    console.log(content.split('\n').map((line) =>  { return line.trim()} ))
    //return
    content = content
      .split('\n')
      .map((line) => line.trim())
      .map((line) => {
        line = line.trim()

        if (!line || line.startsWith('#'))
          return line
        
        let keyName = extractKeyPrefix(line)

        //console.log(`keyName=${keyName}`)

        let findEnvVariable = envKeysToGenerate.find(e => e.name === keyName)

        //console.log('findEnvVariable', typeof (findEnvVariable))

        if (findEnvVariable) {
          if (!getExistingKeyValue(keyName)) {
            findEnvVariable.processed = true
            return `${keyName}=${findEnvVariable.value}`
          } else {
            return `${line}`
          }
        }
        else {
          return line
        }
      }).join('\n') .replace(/^[\r\n]+|[\r\n]+$/g, '')
    
    //const content = fs.readFileSync('.env', 'utf-8');
    const envContent = [
      content, 
      envKeysToGenerate.filter(e => !e.processed)
                       .map(e => [
                            `\n## ${e.name.replace(/_/g, ' ').trim().toUpperCase()}\n`,
                            `${e.name}=${e.value}`,
                          ].join('')
                        )
                       .join('\n')
    ]
    .join('\n')
    .replace(/^[\r\n]+|[\r\n]+$/g, '');

  // console.log(envContent)

  fs.writeFileSync('.env', envContent);

  console.log('Chiavi generate e impostate nel file .env');
}

function main() {
  // Ottieni l'opzione --force dall'array di argomenti
  console.log(process.argv)
  const forceOptionIndex = process.argv.indexOf('--force');
  const force = forceOptionIndex !== -1;

  const existingEnvVariables = envVariablesFile();
  //console.log(existingEnvVariables) 

  // Genera o aggiorna solo le chiavi ambientali mancanti
  envKeysToGenerate.forEach((keyConfig) => {
      let keyValueOrNull = force ? undefined : existingEnvVariables[keyConfig.name]
      const generatedValue = generateKeyIfMissing(keyValueOrNull, keyConfig.type);
      keyConfig.value = generatedValue;
      // existingEnvVariables[keyConfig.name] = generatedValue;

  });
  console.log(envKeysToGenerate)
  //return
  //console.log(existingEnvVariables)
  writeEnvFile();
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
