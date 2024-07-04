const symbolModel = require('../models/symbolModel')
const Sequelize = require('sequelize');

function getSymbols() {
    return symbolModel.findAll();
}

function searchSymbols(search, onlyFavorites = false, page = 1) {
    const options = {
        where: {},
        order: [['symbol', 'ASC']],
        limit: 10,
        offset: 10 * (page - 1)
    };

    if (search) {
        if (search.length < 6)
            options.where = { symbol: { [Sequelize.Op.like]: `%${search.toUpperCase()}%` } }
        else
            options.where = { symbol: search }
    }

    if (onlyFavorites) options.where.isFavorite = true;

    return symbolModel.findAndCountAll(options);
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

    if (newSymbol.base && newSymbol.base !== currenSymbol.base)
        currenSymbol.base = newSymbol.base;
    
    if (newSymbol.quote && newSymbol.quote !== currenSymbol.quote)
        currenSymbol.quote = newSymbol.quote;

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
    bulkInsert,
    searchSymbols
}