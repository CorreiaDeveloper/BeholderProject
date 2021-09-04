const Binance = require('node-binance-api');
const LOGS = process.env.BINANCE_LOGS === 'true';

module.exports = (settings) => {

    if (!settings) throw new Error(`The settings object is required to connect on exchange!`);

    const binance = new Binance({
        APIKEY: settings.accessKey,
        APISECRET: settings.secretKey,
        recvWindow: 60000,
        urls: {
            base: settings.apiUrl.endsWith('/') ? settings.apiUrl : settings.apiUrl + '/'
        },
        verbose: LOGS
    });

    function exchangeInfo() {
        return binance.exchangeInfo();
    }

    return {
        exchangeInfo
    }
}