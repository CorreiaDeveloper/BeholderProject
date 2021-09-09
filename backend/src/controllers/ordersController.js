const settingsRepository = require('../repositories/settingsRepository');
const ordersRepository = require('../repositories/ordersRepository');

async function getOrders(req, res, next) {
    const symbol = req.params.symbol && req.params.symbol.toUpperCase();
    const page = parseInt(req.query.page);
    const orders = await ordersRepository.getOrders(symbol, page || 1);
    res.json(orders);
}

async function placeOrder(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getSetingsDecrypted(id);
    const exchange = require('../utils/exchange')(settings.get({ plain: true }));

    const { side, symbol, quantity, price, type, options, automationId } = req.body;

    //CHAMADA DA API
    let result;

    try {
        if (side === 'BUY')
            result = await exchange.buy(symbol, quantity, price, options);
        else if (side === 'SELL')
            result = await exchange.sell(symbol, quantity, price, options);
    }
    catch (err) {
        return res.status(400).json(err.body);
    }
    //FIM DA CHAMADA DA API

    const order = await ordersRepository.insertOrder({
        automationId,
        symbol,
        quantity,
        type,
        side,
        limitPrice: price,
        stopPrice: options ? options.stopPrice : null,
        icebergQty: options ? options.icebergQty : null,
        orderId: result.orderId,
        clientOrderId: result.clientOrderId,
        transactTime: result.transactTime,
        status: result.status
    })

    res.status(201).json(order.get({ plain: true }));
}

async function cancelOrder(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getSetingsDecrypted(id);
    const exchange = require('../utils/exchange')(settings);

    const { symbol, orderId } = req.params;

    let result;
    try {
        result = await exchange.cancel(symbol, orderId);
    }
    catch (err) {
        return res.status(400).json(err.body);
    }

    const order = await ordersRepository.updateOrderByOrderId(result.orderId, result.origClientOrderId, {
        status: result.status
    })
    res.json(order.get({ plain: true }));
}

module.exports = {
    placeOrder,
    cancelOrder,
    getOrders
}