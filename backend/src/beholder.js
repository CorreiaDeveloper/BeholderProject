const MEMORY = {}

let BRAIN = {}

const LOGS = process.env.BEHOLDER_LOGS === 'true';

function init(automations) {
    //carregar o BRAIN
}

function updateMemory(symbol, index, interval, value) {
    //symbol:index_interval
    //BTCUSD:RSI_1m

    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;
    MEMORY[memoryKey] = value;

    if (LOGS) console.log(`Beholder memory updated: ${memoryKey} => ${JSON.stringify(value)}`);

    // logica de processamento do estímulo
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
    init
}