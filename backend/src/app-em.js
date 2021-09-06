const WebSocket = require('ws');
const crypto = require('./utils/crypto');

module.exports = (settings, wss) => {
    if (!settings) throw new Error(`You can't init the Exchange Monitor App without his settings. Check your database and/or startup code.`);

    const exchange = require('./utils/exchange')(settings);

    function broadcast(jsonObject) {
        if (!wss || !wss.clients) return;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(jsonObject));
            }
        });
    }

    exchange.miniTickerStream(markets => {
        //console.log(markets);
        broadcast({ miniTicker: markets });
    })

    let book = [];
    exchange.bookStream(order => {
        //console.log(markets);
        if (book.length === 200) {
            broadcast({ book })
            book = [];
        } else book.push({ ...order });
    })

    exchange.userDataStream(balanceData => {
        //console.log(balanceData);
        broadcast({ balance: balanceData })
    },
        executionData => console.log(executionData)
    )

    console.log('App Exchange Monitor is running!');
}