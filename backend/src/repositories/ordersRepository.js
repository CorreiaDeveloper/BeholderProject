const orderModel = require('../models/orderModel');
const Sequelize = require('sequelize');

const orderStatus = {
    FILLED: 'FILLED',
    PARTIALLY_FILLED: 'PARTIALLY_FILLED',
    CANCELED: 'CANCELED',
    REJECTED: 'REJECTED',
    NEW: 'NEW'
}

function insertOrder(newOrder) {
    return orderModel.create(newOrder);
}

function getOrders(symbol, page = 1) {
    const options = {
        where: {},
        order: [['id', 'DESC']],
        limit: 10,
        offset: 10 * (page - 1),
        distinct: true
    };

    if (symbol) {
        if (symbol.length < 6)
            options.where = { symbol: { [Sequelize.Op.like]: `%${symbol}%` } }
        else
            options.where = { symbol }
    }

    return orderModel.findAndCountAll(options);
}

async function getOrderById(id) {
    const order = await orderModel.findOne({ where: { id } });
    return order;
}

async function getOrder(orderId, clientOrderId) {
    const order = await orderModel.findOne({ where: { orderId, clientOrderId } });
    return order;
}

async function updateOrderById(id, newOrder) {
    const order = await getOrderById(id);
    if (!order) return false;
    return updateOrder(order, newOrder);
}

async function updateOrderByOrderId(orderId, clientOrderId, newOrder) {
    const order = await getOrder(orderId, clientOrderId);
    if (!order) return false;
    return updateOrder(order, newOrder);
}

async function updateOrder(currentOrder, newOrder) {
    if (!currentOrder || !newOrder) return false;

    if (newOrder.status &&
        newOrder.status !== currentOrder.status &&
        (currentOrder.status === 'NEW' || currentOrder.status === 'PARTIALLY_FILLED'))
        currentOrder.status = newOrder.status;//somente dá para atualizar ordens não finalizadas

    if (newOrder.avgPrice && newOrder.avgPrice !== currentOrder.avgPrice)
        currentOrder.avgPrice = newOrder.avgPrice;

    if (newOrder.isMaker !== null && newOrder.isMaker !== undefined && newOrder.isMaker !== currentOrder.isMaker)
        currentOrder.isMaker = newOrder.isMaker;

    if (newOrder.obs && newOrder.obs !== currentOrder.obs)
        currentOrder.obs = newOrder.obs;

    if (newOrder.transactTime && newOrder.transactTime !== currentOrder.transactTime)
        currentOrder.transactTime = newOrder.transactTime;

    if (newOrder.commission && newOrder.commission !== currentOrder.commission)
        currentOrder.commission = newOrder.commission;

    if (newOrder.net && newOrder.net !== currentOrder.net)
        currentOrder.net = newOrder.net;

    await currentOrder.save();
    return currentOrder;
}

const STOP_TYPES = ["STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT"];

module.exports = {
    orderStatus,
    insertOrder,
    getOrders,
    getOrder,
    getOrderById,
    updateOrderById,
    updateOrderByOrderId
}
