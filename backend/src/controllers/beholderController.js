const beholder = require('../beholder');

function getMemory(req, res, next) {
    res.json(beholder.getMemory());
}

function getMemoryIndexes(req, res, next) {
    res.json(beholder.getMemoryIndexes());
}

function getBrain(req, res, next) {
    res.json(beholder.getBrain());
}

module.exports = {
    getMemory,
    getMemoryIndexes,
    getBrain
}