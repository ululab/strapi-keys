const { exec } = require("child_process");

const param = "--refresh"; // Replace the parameter 

// Conclusion of cron task
exec(`npm run strapi-keys -- ${param}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore: ${error.message}`);
    return;
  }
  console.log(`Output: ${stdout}`);
  console.error(`Erros: ${stderr}`);
});
