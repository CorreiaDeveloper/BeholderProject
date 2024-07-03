const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/ordersController.js');

router.get('/:symbol?', OrdersController.getOrders);

router.post('/', OrdersController.placeOrder);

router.delete('/:symbol/:orderId', OrdersController.cancelOrder);

module.exports = router;