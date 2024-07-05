import React, { useRef, useState, useEffect } from "react";
import { cancelOrder } from "../../services/OrdersService";
import { useHistory } from "react-router-dom";
import { syncOrder } from "../../services/OrdersService";

/**
 * props
 * - data
 * - onCancel
*/

function ViewOrderModal(props) {

    const history = useHistory();

    const btnClose = useRef('');
    const btnCancel = useRef('');
    const [error, setError] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const [order, setOrder] = useState({
        symbol: ''
    })

    function onSyncClick(event) {
        setIsSyncing(true);
    }

    useEffect(() => {
        if(!isSyncing) return;
        const token = localStorage.getItem('token');
        syncOrder(order.id, token)
        .then(updatedOrder => {
            setIsSyncing(false);
            setOrder(updatedOrder);
        })
        .catch(err => {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data : err.message);
            setIsSyncing(false);
        })
    }, [isSyncing])

    useEffect(() => {
        if (props.data) {
            setOrder(props.data);

            btnCancel.current.disabled = props.data.status !== 'NEW';
        }
    }, [props.data])

    function getStatusClass(status) {
        switch (status) {
            case 'PARTIALLY_FILLED': return 'badge bg-info';
            case 'FILLED': return 'badge bg-success';
            case 'REJECTED':
            case 'EXPIRED':
            case 'CANCELED': return "badge bg-danger";
            default: return "badge bg-primary";
        }
    }

    function getDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        })
            .format(date);
    }

    function onCancelClick(event) {
        const token = localStorage.getItem('token');
        cancelOrder(order.symbol, order.orderId, token)
            .then(result => {
                btnClose.current.click();
                if (props.onCancel) props.onCancel({ target: { id: 'order', value: order.orderId } });
                return history.push('/orders/' + order.symbol);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    btnClose.click();
                    history.push('/');
                }
                console.error(err);
                setError(err.message);
            })
    }


    return (
        <div className='modal fade' id="modalViewOrder" tabIndex="-1" role='dialog' aria-labelledby='modalTitleNotify' aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title">Order Details</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" arial-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Symbol:</b> {order.symbol}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <span className={getStatusClass(order.status)}>{order.status}</span>
                                    {
                                        order.isMaker
                                            ?
                                            <span className="badge bg-warning" title="MAKER">M</span>
                                            : <React.Fragment></React.Fragment>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Beholder ID:</b> {order.id}
                                </div>
                                {
                                    order.automationId
                                        ?
                                        (
                                            <div className="col-md-6 mb-3">
                                                <b>Automation ID:</b> {order.automationId}
                                            </div>
                                        )
                                        : <React.Fragment></React.Fragment>

                                }
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <b>Binance IDs:</b> {order.orderId} / {order.clientOrderId}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Side:</b> {order.side}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Type:</b> {order.type}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Quantity:</b> {order.quantity}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Unit Price:</b> {order.limitPrice}
                                </div>
                            </div>
                            <div className="row">
                                {
                                    order.icebergQuantity
                                        ?
                                        (
                                            <div className="col-md-6 mb-3">
                                                <b>Iceberg Qty:</b> {order.icebergQuantity}
                                            </div>
                                        )
                                        : <React.Fragment></React.Fragment>
                                }
                                {
                                    order.stopPrice
                                        ?
                                        (
                                            <div className="col-md-6 mb-3">
                                                <b>Stop Price:</b> {order.stopPrice}
                                            </div>
                                        )
                                        : <React.Fragment></React.Fragment>
                                }
                                <div className="col-md-6 mb-3">
                                    <b>Avg Price:</b> {order.avgPrice}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <b>Date:</b> {getDate(order.transactTime)}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <b>Commission:</b> {order.commission}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <b>Net:</b> {order.net}
                                </div>
                            </div>
                            {
                                order.obs
                                    ? (
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <b>Obs:</b> {order.obs}
                                            </div>
                                        </div>
                                    )
                                    : <React.Fragment></React.Fragment>
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-7 py-1">{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={onSyncClick}>
                            <svg className="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg> {isSyncing ? "Syncing..." : "Sync"}
                        </button>
                        <button type="button" ref={btnCancel} className="btn btn-danger btn-sm" onClick={onCancelClick}>
                            <svg className="icon icon-xs" data-slot="icon" fill="white" stroke-width="1.5" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                            </svg> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrderModal;