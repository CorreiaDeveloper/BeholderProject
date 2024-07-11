const ordersRepository = require('./repositories/ordersRepository');
const { orderStatus } = require('./repositories/ordersRepository');
const { monitorTypes, getActiveMonitors } = require('./repositories/monitorsRepository');
const { RSI, MACD, indexKeys } = require('./utils/indexes')

let WSS, beholder, exchange;

function startMiniTickerMonitor(broadcastLabel, logs) {

    if (!exchange) return new Error(`Exchange monitor not initialized yet!`);

    exchange.miniTickerStream((markets) => {
        if (logs) console.log(markets)

        Object.entries(markets).map(mkt => {
            delete mkt[1].volume;
            delete mkt[1].quoteVolume;
            delete mkt[1].eventTime;
            const converted = {};
            Object.entries(mkt[1]).map(prop => converted[prop[0]] = parseFloat(prop[1]));
            beholder.updateMemory(mkt[0], indexKeys.MINI_TICKER, null, converted)
        })

        if (broadcastLabel && WSS) {
            WSS.broadcast({ [broadcastLabel]: markets })
        }

        const books = Object.entries(markets).map(mkt => {
            const book = { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close };

            beholder.updateMemory(mkt[0], indexKeys.BOOK, null, book);

            return book;
        })
        if (WSS) WSS.broadcast({ book: books });
    })
    console.log(`Mini-Ticker Monitor has started at ${broadcastLabel}`)
}

async function loadWallet() {
    if (!exchange) return new Error(`Exchange monitor not initialized yet!`);
    const info = await exchange.balance();
    const wallet = Object.entries(info).map(item => {

        beholder.updateMemory(item[0], indexKeys.WALLET, null, parseFloat(item[1].available));

        return {
            symbol: item[0],
            available: item[1].available,
            onOrder: item[1].onOrder
        }
    })
    return wallet;
}

function processExecutionData(executionData, broadcastLabel) {

    if (executionData.x === orderStatus.NEW) return;

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
            .then(order => {
                if (order) {
                    beholder.updateMemory(order.symbol, indexKeys.LAST_ORDER, null, order);
                    if (broadcastLabel && WSS)
                        WSS.broadcast({ [broadcastLabel]: order })
                }
            })
            .catch(err => console.error(err));
    }, 3000)
}

function startUserDataMonitor(broadcastLabel, logs) {
    if (!exchange) return new Error(`Exchange monitor not initialized yet!`);

    const [balanceBroadcast, executionBroadcast] = broadcastLabel.split(',')

    loadWallet();

    exchange.userDataStream(
        balanceData => {
            if (logs) console.log(balanceData);
            const wallet = loadWallet();
            if (balanceBroadcast && WSS)
                WSS.broadcast({ [balanceBroadcast]: wallet });
        },
        executionData => {
            if (logs) console.log(executionData);
            processExecutionData(executionData, executionBroadcast)
        }
    )

    console.log(`User Data Monitor has started at ${broadcastLabel}`)
}

function startChartMonitor(symbol, interval, indexes, broadcastLabel, logs) {
    if (!symbol) return new Error(`You can't start a Chart Monitor without a symbol!`)
    if (!exchange) throw new Error(`Exchange Monitor not initialized yet!.`)

    exchange.chartStream(symbol, interval || '1m', (ohlc) => {

        const lastCandle = {
            open: ohlc.open[ohlc.open.length - 1],
            close: ohlc.close[ohlc.close.length - 1],
            high: ohlc.high[ohlc.high.length - 1],
            low: ohlc.low[ohlc.low.length - 1],
            volume: ohlc.volume[ohlc.volume.length - 1]
        }

        if (logs) console.log(lastCandle);

        beholder.updateMemory(symbol, indexKeys.LAST_CANDLE, interval, lastCandle);

        if (broadcastLabel && WSS) WSS.broadcast({ [broadcastLabel]: lastCandle })

        processChartData(symbol, indexes, interval, ohlc)
    });

    console.log(`Chart Monitor has started at ${symbol}_${interval}!`)
}

function processChartData(symbol, indexes, interval, ohlc) {
    indexes.map(index => {
        switch (index) {
            case indexKeys.RSI: {
                return beholder.updateMemory(symbol, indexKeys.RSI, interval, RSI(ohlc.close));
            }
            case indexKeys.MACD: {
                return beholder.updateMemory(symbol, indexKeys.MACD, interval, MACD(ohlc.close));
            }
            default: return;
        }
    })
}


async function init(settings, wssInstance, beholderInstance) {
    if (!settings || !beholderInstance) throw new Error(`Can't start Exchange without settings and/or Beholder.`)

    WSS = wssInstance;
    beholder = beholderInstance;
    exchange = require('./utils/exchange')(settings);

    const monitors = await getActiveMonitors();
    monitors.map(monitor => {
        setTimeout(() => {
            switch (monitor.type) {
                case monitorTypes.MINI_TICKER:
                    return startMiniTickerMonitor(monitor.broadcastLabel, monitor.logs);
                case monitorTypes.BOOK:
                    return;
                case monitorTypes.USER_DATA:
                    return startUserDataMonitor(monitor.broadcastLabel, monitor.logs);
                case monitorTypes.CANDLES:
                    return startChartMonitor(monitor.symbol,
                        monitor.interval,
                        monitor.indexes.split(','),
                        monitor.broadcastLabel,
                        monitor.logs);
            }
        }, 250)
    })

    console.log(`App Exchange Monitor is running`)
}

module.exports = {
    init,
    startChartMonitor
}