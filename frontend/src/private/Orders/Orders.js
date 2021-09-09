import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import SearchSymbol from '../../components/SearchSymbol/SearchSymbol';
import NewOrderButton from '../../components/NewOrder/NewOrderButton';
import NewOrderModal from '../../components/NewOrder/NewOrderModal';
import OrderRow from './OrderRow';
import { getOrders } from '../../services/OrdersService';
import Pagination from '../../components/Pagination/Pagination';

import { getBalance } from '../../services/ExchangeService';

function Orders() {

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            setPage(getPage(location));
        })
    }, [history])

    const { symbol } = useParams();

    const [search, setSearch] = useState(symbol ? symbol : '');

    const [orders, setOrders] = useState([]);

    const [count, setCount] = useState(0);

    const [viewOrder, setViewOrder] = useState({});

    const [page, setPage] = useState(getPage());

    useEffect(() => {
        const token = localStorage.getItem("token");
        getOrders(search, page || 1, token)
            .then(result => {
                setOrders(result.rows);
                setCount(result.count);
                setViewOrder(result.rows[0]);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
            })

    }, [search, page])

    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    function onViewClick(event) {
        const id = event.target.id.replace('view', '');
        // eslint-disable-next-line
        setViewOrder(orders.find(o => o.id == id));
    }

    function onOrderSubmit(order) {
        history.go(0);
    }

    const [balances, setBalances] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getBalance(token)
            .then(info => {
                const balances = Object.entries(info).map(item => {
                    return {
                        symbol: item[0],
                        available: item[1].available,
                        onOrder: item[1].onOrder
                    }
                })
                setBalances(balances);
            })
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }, [])

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Orders</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="d-inline-flex align-items-center">
                            <NewOrderButton />
                        </div>
                        <div className="btn-group ms-2 ms-lg-3">
                            <SearchSymbol onChange={onSearchChange} placeholder={search} />
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Date</th>
                                <th className="border-gray-200">Side</th>
                                <th className="border-gray-200">Qty</th>
                                <th className="border-gray-200">Net</th>
                                <th className="border-gray-200">Status</th>
                                <th className="border-gray-200">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders && orders.length
                                    ? orders.map(order => (<OrderRow key={order.clientOrderId} data={order} onClick={onViewClick} />))
                                    : <React.Fragment></React.Fragment>
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
            </main>
            
            <NewOrderModal wallet={balances} onSubmit={onOrderSubmit} />
        </React.Fragment>
    );
}

export default Orders;
