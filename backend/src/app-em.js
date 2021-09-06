const crypto = require('./utils/crypto');

module.exports = (settings, wss) => {
    if (!settings) throw new Error(`You can't init the Exchange Monitor App without his settings. Check your database and/or startup code.`);

    settings.secretKey = crypto.decrypt(settings.secretKey);
    const exchange = require('./utils/exchange')(settings);

    exchange.miniTickerStream(markets => {
        //console.log(markets);
        if (!wss || !wss.clients) return;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ miniTicker: markets }));
            }
        });
    })

    console.log('App Exchange Monitor is running!');
}