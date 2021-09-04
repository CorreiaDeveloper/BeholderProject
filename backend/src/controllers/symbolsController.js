const symbolsRepository = require('../repositories/symbolsRepository');

async function updateSymbol(req, res, next) {
    const symbol = req.params.symbol;
    const newSymbol = req.body;

    const result = await symbolsRepository.updateSymbol(symbol, newSymbol);
    res.json(result);
}

async function getSymbols(req, res, next) {
    const { search, page, onlyFavorites } = req.query;

    let result;
    if (search || page || onlyFavorites === 'true')
        result = await symbolsRepository.searchSymbols(search, onlyFavorites === 'true', page);
    else
        result = await symbolsRepository.getSymbols();

    res.json(result);
}

async function getSymbol(req, res, next) {
    const symbol = req.params.symbol;
    const symbolObj = await symbolsRepository.getSymbol(symbol);
    res.json(symbolObj);
}

async function syncSymbols(req, res, next) {
    res.sendStatus(200);
}

module.exports = {
    updateSymbol,
    syncSymbols,
    getSymbols,
    getSymbol
}
