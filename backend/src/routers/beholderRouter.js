const express = require('express');
const router = express.Router();
const beholderController = require('../controllers/beholderController');

router.get('/memory', beholderController.getMemory);

router.get('/memory/indexes', beholderController.getMemoryIndexes);

router.get('/brain/indexes', beholderController.getBrainIndexes);

router.get('/brain', beholderController.getBrain);

module.exports = router;