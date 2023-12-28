const argvOptions = [
    {
        value: '--help',
        description: 'Elenca tutti i comandi disponibili'
    },
    {
        value: '--refresh',
        description: 'Sovrascrivi forzatemente tutte le chiavi'
    },
    {
        value: '--generate',
        description: 'Genera le chiavi dove mancano'
    },
    {
        value: '--clear',
        description: 'Elimina i valori delle chiavi'
    },
    {
        value: '--dryrun',
        description: 'Stampa a video le varabili coinvolte in base al comando lanciato'
    },
    {
        value: '--print',
        description: 'Stampa a video delle variabili nuove'
    },
    {
        value: '--status',
        description: 'Stampa a video la situazone delle chiavi: controlla le chiavi e ne stampa i valore presente'
    }
];

module.exports = argvOptions;