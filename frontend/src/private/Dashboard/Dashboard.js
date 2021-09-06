import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Menu from '../../components/Menu/Menu';
import LineChart from './LineChart';
import MiniTicker from './MiniTicker/MiniTicker';
import BookTicker from './BookTicker/BookTicker';
import Wallet from './Wallet/Wallet';

function Dashboard() {

    const [tickerState, setTickerState] = useState({});

    const [balanceState, setBalanceState] = useState({});

    const [bookState, setBookState] = useState({});

    const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        onOpen: () => {
            console.log(`Connected to App WS`);
        },
        onMessage: () => {
            if (lastJsonMessage) {
                if (lastJsonMessage.miniTicker)
                    setTickerState(lastJsonMessage.miniTicker);
                else if (lastJsonMessage.balance) {
                    setBalanceState(lastJsonMessage.balance);
                }
                else if (lastJsonMessage.book) {
                    lastJsonMessage.book.forEach(b => bookState[b.symbol] = b);
                    setBookState(bookState);
                }
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
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Dashboard</h1>
                    </div>
                </div>
                <LineChart />
                <div className="row">
                    <div className="col-12">
                        <MiniTicker data={tickerState} />
                    </div>
                </div>
                <div className="row">
                    <BookTicker data={bookState} />
                    <Wallet data={balanceState} />
                </div>
            </main>
        </React.Fragment>
    );
}

export default Dashboard;
