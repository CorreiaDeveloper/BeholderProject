import React, { useState, useEffect, useRef } from "react";
import { updateSymbol } from "../../services/SymbolsService";
import { useHistory } from "react-router-dom";

function SymbolModal(props) {

    const btnClose = useRef('');
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState({});

    const history = useHistory();

    useEffect(() => {
        if (!props.data) return;
        setSymbol(props.data);
    }, [props.data])

    function onInputChange(event) {
        setSymbol(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function getStarFillColor() {
        return symbol.isFavorite ? "yellow" : "white";
    }

    function OnFavoriteClick(event) {
        setSymbol(prevState => ({ ...prevState, isFavorite: !symbol.isFavorite }));
    }

    function onSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        updateSymbol(symbol, token)
            .then(result => {
                setError('');
                props.onSubmit({ target: { id: 'symbol', value: symbol } });
                btnClose.current.click();
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    btnClose.current.click();
                    return history.push('/');
                }
                console.error(err);
                setError(err.response ? err.response.data : err.message)
            });
    }

    return (
        <div className="modal fade" id="modalSymbol" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">Edit Symbol</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="py-3">
                                <div className="form-group mb-4">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group mb-4">
                                                <label htmlFor="symbol">Symbol</label>
                                                <div className="input-group">
                                                    <input className="form-control" id="symbol" type="text" placeholder="BTCUSD" defaultValue={symbol.symbol} required disabled />
                                                    <button type="button" className="btn btn-secondary d-inline-flex align-items-center me-2" onClick={OnFavoriteClick}>
                                                        <svg className="icon icon-xs" data-slot="icon" fill={getStarFillColor()} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={OnFavoriteClick} aria-hidden="true">  <path clipRule="evenodd" fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="basePrecision">Base Precision:</label>
                                                <input type="number" className="form-control" id="basePrecision" placeholder="8" defaultValue={symbol.basePrecision} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="quotePrecision">Quote Precision:</label>
                                                <input type="number" className="form-control" id="quotePrecision" placeholder="8" defaultValue={symbol.quotePrecision} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minNotional">Min Notional:</label>
                                                <input type="text" className="form-control" id="minNotional" placeholder="0.1" defaultValue={symbol.minNotional} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minLotSize">Min Lot Size:</label>
                                                <input type="text" className="form-control" id="minLotSize" placeholder="0.1" defaultValue={symbol.minLotSize} required onChange={onInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                error
                                    ? <div className="alert alert-danger">{error}</div>
                                    : <React.Fragment></React.Fragment>
                            }
                            <button type="submit" className="btn btn-sm btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SymbolModal;