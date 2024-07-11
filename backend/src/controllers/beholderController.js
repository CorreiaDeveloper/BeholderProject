const beholder = require('../beholder');

function getMemory(req, res, next) {
    res.json(beholder.getMemory());
}

function getBrain(req, res, next) {
    res.json(beholder.getBrain());
}

module.exports = {
    getMemory,
    getBrain
}