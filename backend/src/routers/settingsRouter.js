const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.patch('/', settingsController.updateSettings);

router.get('/', settingsController.getSettings);

module.exports = router;