import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

function Dashboard() {

    const [tickerState, setTickerState] = useState({});

    const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        onOpen: () => {
            console.log(`Connected to App WS`);
        },
        onMessage: () => {
            if (lastJsonMessage) {
                if (lastJsonMessage.miniTicker)
                    setTickerState(lastJsonMessage.miniTicker);
            }
        },
        queryParams: {},
        onError: (event) => {
            console.error(event);
        },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });

    return (
        <React.Fragment>
            {JSON.stringify(tickerState)}
        </React.Fragment>
    );
}

export default Dashboard;
