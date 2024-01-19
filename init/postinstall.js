const fs = require("fs");
const path = require("path");


function readPackageJson () { 

  const packageJsonPath = path.join(process.cwd(), "../../package.json");

  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync("postinstall.log", "package.json is not found");
    return;
  }

  try {
    return fs.readFileSync(packageJsonPath, "utf-8");
  } catch (error) {
    console.error(error);
    return fs.writeFileSync(
      "postinstall.log",
      "package.json has not been properly read"
    );
  }
}

function prepareNewScriptsContent(){

  let { scripts } = JSON.parse(readPackageJson());

  if (!scripts) {
    let scriptsContent = generateNewScripts();
    scripts = scriptsContent
  }

  const keyFound = Object.keys(scripts).find(key => key === 'strapi-keys');

  if (!keyFound) { 
    scripts['strapi-keys'] = 'strapi-keys'
  }
  return scripts;
}

  function generateNewContent(){
    return `"strapi-keys": "strapi-keys"`
  }

  function generateNewScripts(){
    return `"scripts": { \n\t` + generateNewContent() + `\n}` 
  }

  try {
    fs.writeFileSync("postinstall.log", JSON.stringify(prepareNewScriptsContent()));
  } catch (error) {
    console.error(error)
  }
  console.log(prepareNewScriptsContent());

return;
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
