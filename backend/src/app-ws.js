const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const authController = require('./controllers/authController');

function onError(err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(data) {
    console.log(`onMessage: ${data}`);
}

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    if (!corsValidation(info.origin)) return callback(false, 401);

    const token = info.req.url.split('token=')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && !authController.isBlacklisted(token)) {
                return callback(true);
            }
        } catch (err) {
            console.log(token, err);
        }
    }
    return callback(false, 401);
}

function onConnection(ws, req) {
    ws.on('message', onMessage);
    ws.on('error', onError);
    console.log(`onConnection`);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient
    });
    wss.on('connection', onConnection);
    console.log(`App Web Socket Server is running!`);
    return wss;
}