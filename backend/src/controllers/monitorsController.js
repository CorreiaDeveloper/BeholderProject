const monitorsRepository = require('../repositories/monitorsRepository');
const appEm = require('../app-em');
const { monitorTypes } = require('../repositories/monitorsRepository');

async function startMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);

    if (monitor.isActive) return res.sendStatus(204);
    if (monitor.isSystemMon) return res.status(403).send(`You can't start or stop the system monitors.`);

    const indexes = monitor.indexes ? monitor.indexes.split(',') : [];
    appEm.startChartMonitor(monitor.symbol, monitor.interval, indexes, monitor.broadcastLabel, monitor.logs);

    monitor.isActive = true;
    await monitor.save();
    res.json(monitor);
}

async function stopMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);
    if (!monitor.isActive) return res.sendStatus(204);
    if (monitor.isSystemMon) return res.status(403).send(`You can't start or stop the system monitors.`);

    const indexes = monitor.indexes ? monitor.indexes.split(',') : [];

    appEm.stopChartMonitor(monitor.symbol, monitor.interval, indexes, monitor.logs);

    monitor.isActive = false;
    await monitor.save();
    res.json(monitor);
}

async function getMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);
    res.json(monitor);
}

async function getMonitors(req, res, next) {
    const page = req.query.page;
    const monitors = await monitorsRepository.getMonitors(page);
    res.json(monitors);
}

async function insertMonitor(req, res, next) {
    const newMonitor = req.body;
    const savedMonitor = await monitorsRepository.insertMonitor(newMonitor);

    if (savedMonitor.isActive) {
        const indexes = savedMonitor.indexes ? savedMonitor.indexes.split(',') : [];
        appEm.startChartMonitor(savedMonitor.symbol, savedMonitor.interval, indexes, savedMonitor.broadcastLabel, savedMonitor.logs);
    }

    res.status(201).json(savedMonitor.get({ plain: true }));
}

function stopStreamMonitor(monitor) {
    switch (monitor.type) {
        case monitorTypes.CANDLES: {
            appEm.stopChartMonitor(monitor.symbol, monitor.interval, monitor.indexes ? monitor.indexes.split(',') : [], monitor.logs);
            break;
        }
        case monitorTypes.TICKER: {
            appEm.stopTickerMonitor(monitor.id, monitor.symbol, monitor.logs);
            break;
        }
    }
}

function startStreamMonitor(monitor) {
    switch (monitor.type) {
        case monitorTypes.CANDLES: {
            appEm.startChartMonitor(monitor.symbol, monitor.interval, monitor.indexes ? monitor.indexes.split(',') : [], monitor.broadcastLabel, monitor.logs);
            break;
        }
        case monitorTypes.TICKER: {
            appEm.startTickerMonitor(monitor.symbol, monitor.broadcastLabel, monitor.logs);
            break;
        }
    }
}

async function updateMonitor(req, res, next) {
    const id = req.params.id;
    const newMonitor = req.body;

    const currentMonitor = await monitorsRepository.getMonitor(id);
    if (currentMonitor.isSystemMon) return res.sendStatus(403);

    const updatedMonitor = await monitorsRepository.updateMonitor(id, newMonitor);
    stopStreamMonitor(currentMonitor);

    if (updatedMonitor.isActive)
        startStreamMonitor(updatedMonitor);

    res.json(updatedMonitor);
}

async function deleteMonitor(req, res, next) {
    const id = req.params.id;
    const currentMonitor = await monitorsRepository.getMonitor(id);
    if (currentMonitor.isSystemMon) return res.sendStatus(403);

    if (currentMonitor.isActive) stopStreamMonitor(currentMonitor);

    await monitorsRepository.deleteMonitor(id);

    res.sendStatus(204);
}


module.exports = {
    getMonitor,
    getMonitors,
    insertMonitor,
    updateMonitor,
    deleteMonitor,
    startMonitor,
    stopMonitor
}