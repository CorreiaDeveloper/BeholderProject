const MEMORY = {}

let BRAIN = {}

let LOCK_MEMORY = false;

let LOCK_BRAIN = false;

const LOGS = process.env.BEHOLDER_LOGS === 'true';

function init(automations) {
    //carregar o BRAIN
}

function updateMemory(symbol, index, interval, value) {
    if (LOCK_MEMORY) return false;

    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;
    
    MEMORY[memoryKey] = value;

    if (LOGS) console.log(`Beholder memory updated: ${memoryKey} => ${JSON.stringify(value)}`);

    // logica de processamento do estímulo
}

function deleteMemory(symbol, index, interval) {
    try {
        const indexKey = interval ? `${index}_${interval}` : index;
        const memoryKey = `${symbol}:${indexKey}`;

        LOCK_MEMORY = true;
        delete MEMORY[memoryKey];
        if (LOGS) console.log(`Beholder memory delete: ${memoryKey}`);
    }
    finally {
        LOCK_MEMORY = false;
    }
}

function getMemory() {
    return { ...MEMORY };
}

function getBrain() {
    return { ...BRAIN };
}

module.exports = {
    updateMemory,
    getMemory,
    getBrain,
    init,
    deleteMemory
}