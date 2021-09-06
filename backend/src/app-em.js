const crypto = require('./utils/crypto');

module.exports = (settings) => {
    settings.secretKey = crypto.decrypt(settings.secretKey);
    const exchange = require('./utils/exchange')(settings);

    exchange.miniTickerStream(markets => {
        console.log(markets);
    })
}