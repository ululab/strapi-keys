
const fs = require('fs');
const path = require('path');

console.log('POST INSTALL');

// return;


// Percorso del file package.json
const packageJsonPath = path.join(process.cwd(), '../../package.json')
console.log(packageJsonPath)
if (!fs.existsSync(packageJsonPath)){
  // console.log()
  fs.writeFileSync('postinstall.log', "Non e' stato trovato il pacchetto");
  return
}

try {
  var content = fs.readFileSync(packageJsonPath, 'utf-8');
  return fs.writeFileSync('postinstall.log', content);
} catch (error) {
  console.error(error)
  fs.writeFileSync('postinstall.log', "Non e' stato letto correttamente il pacchetto");
}

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
