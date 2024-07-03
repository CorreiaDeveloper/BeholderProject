const settingsRepository = require('../repositories/settingsRepository');

async function getBalance(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getDecryptedSettings(id);
    const exchange = require('../utils/exchange')(settings);
    const info = await exchange.balance();
    res.json(info);
}

module.exports = {
    getBalance
}