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

    const favoriteSymbols = (await symbolsRepository.getSymbols()).filter(s => s.isFavorite).map(s => s.symbol);

    const settingsRepository = require('../repositories/settingsRepository');
    const settings = await settingsRepository.getSetingsDecrypted(res.locals.token.id);
    const exchange = require('../utils/exchange')(settings);
    const symbols = (await exchange.exchangeInfo()).symbols.map(item => {
        const notionalFilter = item.filters.find(filter => filter.filterType === 'NOTIONAL');
        const lotSizeFilter = item.filters.find(filter => filter.filterType === 'LOT_SIZE');

        return {
            symbol: item.symbol,
            basePrecision: item.baseAssetPrecision,
            quotePrecision: item.quoteAssetPrecision,
            base: item.baseAsset,
            quote: item.quoteAsset,
            minNotional: notionalFilter ? notionalFilter.minNotional : '1',
            minLotSize: lotSizeFilter ? lotSizeFilter.minQty : '1',
            isFavorite: favoriteSymbols.some(s => s === item.symbol)
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
