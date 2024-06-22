const symbolModel = require('../models/symbolModel')

function getSymbols() {
    return symbolModel.findAll();
}

function getSymbol(symbol) {
    return symbolModel.findOne({ where: { symbol } });
}

async function updateSymbol(symbol, newSymbol) {
    const currenSymbol = await getSymbol(symbol);

    if (newSymbol.basePrecision && newSymbol.basePrecision !== currenSymbol.basePrecision)
        currenSymbol.basePrecision = newSymbol.basePrecision;

    if (newSymbol.quotePrecision && newSymbol.quotePrecision !== currenSymbol.quotePrecision)
        currenSymbol.quotePrecision = newSymbol.quotePrecision;

    if (newSymbol.minNotional && newSymbol.minNotional !== currenSymbol.minNotional)
        currenSymbol.minNotional = newSymbol.minNotional;

    if (newSymbol.minLotSize && newSymbol.minLotSize !== currenSymbol.minLotSize)
        currenSymbol.minLotSize = newSymbol.minLotSize;

    if (newSymbol.isFavorite !== null && newSymbol.isFavorite !== undefined
        && newSymbol.isFavorite !== currenSymbol.isFavorite)
        currenSymbol.isFavorite = newSymbol.isFavorite;

    await currenSymbol.save();
}

async function deleteAll() {
    return symbolModel.destroy({ truncate: true });
}

async function bulkInsert(symbols) {
    return symbolModel.bulkCreate(symbols);
}

module.exports = {
    getSymbols,
    getSymbol,
    updateSymbol,
    deleteAll,
    bulkInsert
}