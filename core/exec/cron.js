const { exec } = require("child_process");

const COMMAND_DEFAULT = 'npm run strapi-keys --';

function worker(commandToExcute = '') {

    try {
        
        if (!commandToExcute.startsWith(COMMAND_DEFAULT)) {
            commandToExcute = `${COMMAND_DEFAULT} ${commandToExcute}`.trim()
        }
        
        console.log(`Execute command: ${commandToExcute}`);

        exec(commandToExcute, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
    
            console.log(`Output: ${stdout}`);
    
            if (stderr) {
                console.error(`Error: ${stderr}`);
            }
        }); 
    } catch (error) {
        console.error(error.toString());
    }
    
}

module.exports = worker;