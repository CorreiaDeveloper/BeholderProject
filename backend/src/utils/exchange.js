const Binance = require('node-binance-api');
const LOGS = process.env.BINANCE_LOGS === 'true';

module.exports = (settings) => {

    if (!settings) throw new Error(`The settings object is required to connect on exchange!`);

    const binance = new Binance({
        APIKEY: settings.accessKey,
        APISECRET: settings.secretKey,
        recvWindow: 60000,
        urls: {
            base: settings.apiUrl.endsWith('/') ? settings.apiUrl : settings.apiUrl + '/',
            stream: settings.streamUrl.endsWith('/') ? settings.streamUrl : settings.streamUrl + '/'
        },
        verbose: LOGS
    });

    function exchangeInfo() {
        return binance.exchangeInfo();
    }

    function balance() {
        return binance.balance();
    }

    function miniTickerStream(callback) {
        binance.websockets.miniTicker(markets => {
            callback(markets)
        });
    }

    function bookStream(callback) {
        binance.websockets.bookTickers(order => {
            callback(order)
        });
    }

    async function userDataStream(balaceCallback, executionCallback, listStatusCallback) {
        binance.websockets.userData(
            balance => balaceCallback(balance),
            executionData => executionCallback(executionData),
            subscribedData => console.log(`userDataStream:subscribeEvent: ${JSON.stringify(subscribedData)}`),
            listStatusData => listStatusCallback(listStatusData));
    }

    return {
        exchangeInfo,
        balance,
        miniTickerStream,
        bookStream,
        userDataStream
    }
}