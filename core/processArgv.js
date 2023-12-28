// const optionsCommand = require('./optionsCommand')

// const argvOptions = optionsCommand.map(e => e.value)

const processArgv = process.argv.slice(2);

const useDryRun = processArgv.includes('--dryrun');

const useHelp = processArgv.includes('--help');

const clear = processArgv.includes('--clear');

const print = processArgv.includes('--print');

const force = processArgv.includes('--refresh');

const status = processArgv.includes('--status');

const options = { useDryRun: useDryRun, force: force, useHelp: useHelp, clear: clear, print: print, status: status };

module.exports = options;