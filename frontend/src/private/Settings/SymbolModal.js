import React, { useRef, useEffect, useState } from 'react';
import { updateSymbol } from '../../services/SymbolsService';

/**
 * props:
 * - data
 * - onSubmit
 */
function SymbolModal(props) {

    const symbolInput = useRef('');
    const basePrecisionInput = useRef('');
    const quotePrecisionInput = useRef('');
    const minNotionalInput = useRef('');
    const minLotSizeInput = useRef('');
    const btnClose = useRef('');

    const [error, setError] = useState('');

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {

        symbolInput.current.value = props.data.symbol;
        basePrecisionInput.current.value = props.data.basePrecision;
        quotePrecisionInput.current.value = props.data.quotePrecision;
        minNotionalInput.current.value = props.data.minNotional;
        minLotSizeInput.current.value = props.data.minLotSize;
        setIsFavorite(props.data.isFavorite);

    }, [props.data]);

    function onSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        updateSymbol({
            symbol: symbolInput.current.value,
            basePrecision: basePrecisionInput.current.value,
            quotePrecision: quotePrecisionInput.current.value,
            minNotional: minNotionalInput.current.value,
            minLotSize: minLotSizeInput.current.value,
            isFavorite
        }, token)
            .then(result => {
                setError('');
                props.onSubmit({ target: { id: 'symbol', value: props.data.quote } });
                btnClose.current.click();
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            });
    }

    function getStarFillColor() {
        return isFavorite ? "yellow" : "white";
    }

    function onFavoriteClick(event) {
        setIsFavorite(!isFavorite);
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
                                                    <input ref={symbolInput} className="form-control" id="symbol" type="text" placeholder="BTCUSD" required disabled />
                                                    <button type="button" className="btn btn-secondary d-inline-flex align-items-center me-2" onClick={onFavoriteClick}>
                                                        <svg className="icon icon-xs" fill={getStarFillColor()} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="basePrecision">Base Precision:</label>
                                                <input ref={basePrecisionInput} type="number" className="form-control" id="basePrecision" placeholder="8" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="quotePrecision">Quote Precision:</label>
                                                <input ref={quotePrecisionInput} type="number" className="form-control" id="quotePrecision" placeholder="8" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minNotional">Min Notional:</label>
                                                <input ref={minNotionalInput} type="text" className="form-control" id="minNotional" placeholder="0.1" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minLotSize">Min Lot Size:</label>
                                                <input ref={minLotSizeInput} type="text" className="form-control" id="minLotSize" placeholder="0.1" required />
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