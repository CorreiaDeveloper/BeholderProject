const WebSocket = require('ws');

function onError(err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(data) {
    console.log(`onMessage: ${data}`);
}

function onConnection(ws, req) {
    ws.on('message', onMessage);
    ws.on('error', onError);
    console.log(`onConnection`);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
    wss.on('connection', onConnection);
    console.log(`App Web Socket Server is running!`);
    return wss;
}