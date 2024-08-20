const beholder = require('../beholder');
const indexes = require('../utils/indexes');

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

function getAnalysisIndexes(req, res, next) {
    res.json(indexes.getAnalysisIndexes());
}

module.exports = {
    getMemory,
    getMemoryIndexes,
    getBrain,
    getBrainIndexes,
    getAnalysisIndexes
}