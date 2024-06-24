import React, { useEffect, useState } from "react";
import { getSymbols, syncSymbols } from "../../services/SymbolsService";
import { useHistory } from "react-router-dom";
import SymbolRow from "./SymbolRow";
import SelectQuote, { getDefaultQuote, filterSymbolObjects, setDefaultQuote } from "../../components/SelectQuote/SelectQuote";
import SymbolModal from "./SymbolModal";

function Symbols() {

    const history = useHistory();
    const [symbols, setSymbols] = useState([]);
    const [error, setError] = useState('');
    const [editSymbol, setEditSymbol] = useState({
        symbol: '',
        basePrecision: 8,
        quotePrecision: 8,
        minLotSize: '0.1',
        minNotional: '0.1',
    });
    const [success, setSuccess] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [quote, setQuote] = useState(getDefaultQuote());

    useEffect(() => {
        const token = localStorage.getItem('token')
        getSymbols(token)
            .then(symbols => {
                setSymbols(filterSymbolObjects(symbols, quote));
            })
            .catch(err => {
                if (err.response && err.response.status === 401) history.push('/');
                console.error(err.message);
                setError(err.message);
                setSuccess('');
            });
    }, [isSyncing, quote])

    function onSyncClick(event) {
        const token = localStorage.getItem('token');
        setIsSyncing(true);
        syncSymbols(token)
            .then(response => setIsSyncing(false))
            .catch(err => {
                if (err.response && err.response.status === 401) history.push('/');
                console.error(err.message);
                setError(err.message);
                setSuccess('');
            });

    }

    function errorHandling(err){
        console.error(err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data : err.message);
        setSuccess('');
    }

    function onQuoteChange(event) {
        setQuote(event.target.value);
        setDefaultQuote(event.target.value);
    }

    function loadSymbols(){
        const token = localStorage.getItem('token');
        getSymbols(token)
        .then(symbols => {
            setSymbols(filterSymbolObjects(symbols, quote));
        })
        .catch(err => errorHandling(err))
    }

    useEffect(() => {
        loadSymbols();
    }, [isSyncing, quote]);

    function onEditSymbol(event) {
        const symbol = event.target.id.replace('edit', '');
        const symbolObj = symbols.find(s => s.symbol === symbol);
        setEditSymbol(symbolObj);
    }

    function onModalSubmit(event){
        loadSymbols();
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
                                        <th className="border-bottom" scope="col">Symbol</th>
                                        <th className="border-bottom" scope="col">Base Prec</th>
                                        <th className="border-bottom" scope="col">Quote Prec</th>
                                        <th className="border-bottom" scope="col">Min Notional</th>
                                        <th className="border-bottom" scope="col">Min Lot Size</th>
                                        <th>Actions</th>
                                    </thead>
                                    <tbody>
                                        {symbols.map(item => <SymbolRow key={item.symbol} data={item} onClick={onEditSymbol} />)}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2">
                                                <button className="btn btn-primary animate-up-2" type="button" onClick={onSyncClick}>
                                                    <svg className="icon icon-xs" data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"></path></svg>
                                                    {isSyncing ? "Syncing..." : "Sync"}
                                                </button>
                                            </td>
                                            <td>
                                                {error
                                                    ? <div className="alert alert-danger">{error}</div>
                                                    : <React.Fragment></React.Fragment>
                                                }
                                                {success
                                                    ? <div className="alert alert-success">{success}</div>
                                                    : <React.Fragment></React.Fragment>
                                                }
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SymbolModal data={editSymbol} onSubmit={onModalSubmit}/>
        </React.Fragment>)

}

export default Symbols;