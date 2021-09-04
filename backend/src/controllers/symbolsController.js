const symbolsRepository = require('../repositories/symbolsRepository');
const crypto = require('../utils/crypto');

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
    const settingsRepository = require('../repositories/settingsRepository');
    const settings = await settingsRepository.getSettings(res.locals.token.id);
    settings.secretKey = crypto.decrypt(settings.secretKey);

    const exchange = require('../utils/exchange')(settings);
    const symbols = (await exchange.exchangeInfo()).symbols.map(item => {
        const minNotionalFilter = item.filters.find(filter => filter.filterType === 'MIN_NOTIONAL');
        const minLotSizeFilter = item.filters.find(filter => filter.filterType === 'LOT_SIZE');

        return {
            symbol: item.symbol,
            basePrecision: item.baseAssetPrecision,
            quotePrecision: item.quoteAssetPrecision,
            minNotional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
            minLotSize: minLotSizeFilter ? minLotSizeFilter.minQty : '1',
            isFavorite: false
        }
    });

    await symbolsRepository.deleteAll();
    await symbolsRepository.bulkInsert(symbols);
    res.sendStatus(201);
}

module.exports = {
    updateSymbol,
    syncSymbols,
    getSymbols,
    getSymbol
}
