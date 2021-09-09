import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { searchSymbols, getSymbol, syncSymbols } from '../../services/SymbolsService';
import SymbolModal from './SymbolModal';
import SymbolRow from './SymbolRow';
import Pagination from '../../components/Pagination/Pagination';
import SelectQuote, { getDefaultQuote, setDefaultQuote } from '../../components/SelectQuote/SelectQuote';

function Symbols() {

    const history = useHistory();

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page') || '1';
    }

    useEffect(() => {
        return history.listen((location) => {
            setPage(getPage(location));
        })
    }, [history])

    const [symbols, setSymbols] = useState([]);

    const [quote, setQuote] = useState(getDefaultQuote());

    const [count, setCount] = useState(0);

    const [page, setPage] = useState(getPage());

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [isSyncing, setIsSyncing] = useState(false);

    const [editSymbol, setEditSymbol] = useState({
        symbol: '',
        basePrecision: '',
        quotePrecision: '',
        minNotional: '',
        minLotSize: ''
    });

    function onQuoteChange(event) {
        setQuote(event.target.value);
        setDefaultQuote(event.target.value);
    }

    function errorHandling(err) {
        console.error(err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data : err.message);
        setSuccess('');
    }

    function loadSymbols(selectedValue) {
        const token = localStorage.getItem('token');
        const search = selectedValue === 'FAVORITES' ? '' : selectedValue;
        const onlyFavorites = selectedValue === 'FAVORITES';
        searchSymbols(search, onlyFavorites, getPage(), token)
            .then(result => {
                setSymbols(result.rows);
                setCount(result.count);
            })
            .catch(err => errorHandling(err))
    }

    useEffect(() => {
        loadSymbols(quote);
    }, [isSyncing, quote, page])

    function onModalSubmit(event) {
        loadSymbols(event.target.value);
    }

    function onEditSymbol(event) {
        const token = localStorage.getItem("token");
        const symbol = event.target.id.replace('edit', '');

        getSymbol(symbol, token)
            .then(symbolObj => setEditSymbol(symbolObj))
            .catch(err => errorHandling(err))
    }

    function onSyncClick(event) {
        const token = localStorage.getItem("token");
        setIsSyncing(true);
        syncSymbols(token)
            .then(response => setIsSyncing(false))
            .catch(err => {
                errorHandling(err)
                setIsSyncing(false);
            })
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="col-12 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h2 className="fs-5 fw-bold mb-0">Symbols</h2>
                                    </div>
                                    <div className="col">
                                        <SelectQuote onChange={onQuoteChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-items-center table-flush">
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-bottom" scope="col">Symbol</th>
                                            <th className="border-bottom" scope="col">Base Prec</th>
                                            <th className="border-bottom" scope="col">Quote Prec</th>
                                            <th className="border-bottom" scope="col">Min Notional</th>
                                            <th className="border-bottom" scope="col">Min Lot Size</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {symbols.map(item => <SymbolRow key={item.symbol} data={item} onClick={onEditSymbol} />)}
                                    </tbody>
                                </table>
                                <Pagination count={count} />
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col">
                                            <button className="btn btn-primary animate-up-2" type="button" onClick={onSyncClick}>
                                                <svg className="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                {isSyncing ? "Syncing..." : "Sync"}
                                            </button>
                                        </div>
                                        <div className="col">
                                            {error ? <div className="alert alert-danger">{error}</div> : <React.Fragment></React.Fragment>}
                                            {success ? <div className="alert alert-success">{success}</div> : <React.Fragment></React.Fragment>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SymbolModal data={editSymbol} onSubmit={onModalSubmit} />
        </React.Fragment>
    );
}

export default Symbols;
