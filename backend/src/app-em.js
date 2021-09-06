const crypto = require('./utils/crypto');

module.exports = (settings) => {
    if (!settings) throw new Error(`You can't init the Exchange Monitor App without his settings. Check your database and/or startup code.`);

    settings.secretKey = crypto.decrypt(settings.secretKey);
    const exchange = require('./utils/exchange')(settings);

    exchange.miniTickerStream(markets => {
        console.log(markets);
    })
}