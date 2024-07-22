import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";
import { getMonitors, deleteMonitor, startMonitor, stopMonitor } from "../../services/MonitorsService";
import MonitorRow from "./MonitorRow";
import MonitorModal from "./MonitorModal/MonitorModal";

function Monitors() {

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const history = useHistory();

    useEffect(() => {
        return history.listen(location => {
            setPage(getPage(location));
        })
    }, [history])

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(getPage());
    const [monitors, setMonitors] = useState([]);

    const DEFAULT_MONITOR = {
        symbol: 'BNBBTC',
        type: 'CANDLES',
        interval: '1m',
        isActive: false,
        logs: false
    }
    const [editMonitor, setEditMonitor] = useState(DEFAULT_MONITOR);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getMonitors(page || 1, token)
            .then(result => {
                setMonitors(result.rows);
                setCount(result.count);
            })
            .catch(err => console.error(err.response ? err.response.data : err.message))
    }, [page])

    function onEditClick(event) {
        const id = event.target.id.replace('edit', '');
        setEditMonitor(monitors.find(m => m.id == id));
    }

    function onStopClick(event) {
        const id = event.target.id.replace('stop', '');
        const token = localStorage.getItem('token');
        stopMonitor(id, token)
            .then(monitor => { history.go(0) })
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    function onStartClick(event) {
        const id = event.target.id.replace('start', '');
        const token = localStorage.getItem('token');
        startMonitor(id, token)
            .then(monitor => { history.go(0) })
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    function onDeleteClick(event) {
        const id = event.target.id.replace('delete', '');
        const token = localStorage.getItem('token');
        deleteMonitor(id, token)
            .then(monitor => { history.go(0) })
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    function onModalSubmit(event) {
        history.go(0);
    }

    function onNewMonitorClick() {
        setEditMonitor(DEFAULT_MONITOR);
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Monitors</h2>
                    </div>
                    <div className='btn-toolbar mb-2 mb-md-0'>
                        <div className='d-inline-flex align-items-center'>
                            <button id="btnNewMonitor" className="btn btn-primary animate-up-2" data-bs-toggle="modal" data-bs-target="#modalMonitor" onClick={onNewMonitorClick}>
                                <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                </svg>
                                New Monitor
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Type</th>
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Active</th>
                                <th className="border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                monitors.map(monitor => (
                                    <MonitorRow key={monitor.id} data={monitor} onEditClick={onEditClick} onStartClick={onStartClick} onStopClick={onStopClick} onDeleteClick={onDeleteClick} />
                                ))
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer />
            </main>
            <MonitorModal data={editMonitor} onSubmit={onModalSubmit} />
        </React.Fragment>
    )
}
export default Monitors;