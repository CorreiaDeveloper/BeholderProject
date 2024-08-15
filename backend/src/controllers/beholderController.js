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

function getBrainIndexes(req, res, next) {
    res.json(beholder.getBrainIndexes());
}

module.exports = {
    getMemory,
    getMemoryIndexes,
    getBrain,
    getBrainIndexes
}