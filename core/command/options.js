const commadList = require('./list')

const processArgv = process.argv.slice(2);

const options = {};

for (const command of commadList) {
    options[ command.value.replace(/-/g, '')] = processArgv.includes(command.value);
}

module.exports = options;