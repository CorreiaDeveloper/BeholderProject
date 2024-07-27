import React, { useState, useEffect } from "react";
import Menu from "../../components/Menu/Menu";
import { useHistory, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";
import AutomationRow from "./AutomationRow";
import AutomationModal from "./AutomationModal/AutomationModal";
import { deleteAutomation, getAutomations, startAutomation, stopAutomation } from "../../services/AutomationsServices";

function Automations() {


    const defaultLocation = useLocation();
    const [page, setPage] = useState(getPage());
    const [count, setCount] = useState(0);
    const [automations, setAutomations] = useState([]);

    const DEFAULT_AUTOMATION = {
        name: '',
        conditions: '',
        indexes: ''
    }
    const [editAutomation, setEditAutomation] = useState(DEFAULT_AUTOMATION);

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const history = useHistory();

    useEffect(() => {
        return history.listen(location => setPage(getPage(location)));
    }, [history])

    useEffect(() => {
        const token = localStorage.getItem('token');
        getAutomations(page || 1, token)
            .then(result => {
                setAutomations(result.rows);
                setCount(result.count);
            })
            .catch(err => console.error(err.response ? err.response.data : err.message))
    }, [page])

    function onNewAutomationClick(event) {
        setEditAutomation(DEFAULT_AUTOMATION);
    }

    function onEditAutomationClick(event) {
        const id = event.target.id.replace('edit', '');
        setEditAutomation(automations.find(a => a.id == id));
    }

    function onStartAutomationClick(event) {
        const id = event.target.id.replace('start', '');
        const token = localStorage.getItem('token');
        startAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onStopAutomationClick(event) {
        const id = event.target.id.replace('stop', '');
        const token = localStorage.getItem('token');
        stopAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onDeleteAutomationClick(event) {
        const id = event.target.id.replace('delete', '');
        const token = localStorage.getItem('token');
        deleteAutomation(id, token)
            .then(automation => history.go(0))
            .catch(err => err.response ? err.response.data : err.message);
    }

    function onAutomationSubmit(event) {
        history.go(0);
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Automations</h2>
                    </div>
                    <div className='btn-toolbar mb-2 mb-md-0'>
                        <div className='d-inline-flex align-items-center'>
                            <button id="btnNewAutomation" className="btn btn-primary animate-up-2" data-bs-toggle="modal" data-bs-target="#modalAutomation" onClick={onNewAutomationClick}>
                                <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                </svg>
                                New Automation
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Name</th>
                                <th className="border-gray-200">Active</th>
                                <th className="border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                automations.map(automation => (
                                    <AutomationRow data={automation} onEditClick={onEditAutomationClick} onStartClick={onStartAutomationClick} onStopClick={onStopAutomationClick} onDeleteClick={onDeleteAutomationClick} key={automation.id} />
                                ))
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer />
            </main>
            <AutomationModal data={editAutomation} onSubmit={onAutomationSubmit} />
        </React.Fragment>
    )
}

export default Automations;