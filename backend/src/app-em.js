const WebSocket = require('ws');
const ordersRepository = require('./repositories/ordersRepository');
const { orderStatus } = require('./repositories/ordersRepository');
const technicalindicators = require('technicalindicators');

module.exports = (settings, wss) => {

    if (!settings) throw new Error(`Can't start Exchange without settings.`)

    const exchange = require('./utils/exchange')(settings);

    function broadcast(jsonObject) {
        if (!wss || !wss.clients) return;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(jsonObject));
            }
        });
    }

    exchange.miniTickerStream((markets) => {
        broadcast({ miniTicker: markets })

        const books = Object.entries(markets).map(mkt => {
            return { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close };
        })
        broadcast({ book: books });
    })

    function processExecutionData(executionData) {
        if (executionData.x === orderStatus.NEW) return;//ignora as novas, pois podem ter vindo de outras fontes

        const order = {
            symbol: executionData.s,
            orderId: executionData.i,
            clientOrderId: executionData.X === orderStatus.CANCELED ? executionData.C : executionData.c,
            side: executionData.S,
            type: executionData.o,
            status: executionData.X,
            isMaker: executionData.m,
            transactTime: executionData.T
        }

        if (order.status === orderStatus.FILLED) {
            const quoteAmount = parseFloat(executionData.Z);
            order.avgPrice = quoteAmount / parseFloat(executionData.z);
            order.commission = executionData.n;

            const isQuoteCommission = executionData.N && order.symbol.endsWith(executionData.N);
            order.net = isQuoteCommission ? quoteAmount - parseFloat(order.commission) : quoteAmount;
        }

        if (order.status === orderStatus.REJECTED) order.obs = executionData.r;

        setTimeout(() => {
            ordersRepository.updateOrderByOrderId(order.orderId, order.clientOrderId, order)
                .then(order => order && broadcast({ execution: order }))
                .catch(err => console.error(err));
        }, 3000)
    }

    exchange.userDataStream(
        balanceData => {
            broadcast({ balance: balanceData });
        },
        executionData => {
            processExecutionData(executionData)
        }
    )

    function calcRSI(closes){
        const rsiResult = technicalindicators.rsi({
            period: 14,
            values: closes
        })
        return parseFloat(rsiResult[rsiResult.length - 1]);
    }

    function processChartData(closes, callback) {
        const rsi = calcRSI(closes);
        console.log(rsi);
    }

    exchange.chartStream('BNBBTC', '1m', (ohlc) => processChartData(ohlc.close, (msg) => { console.log(msg); }));

    console.log(`App Exchange Monitor is running`)
}