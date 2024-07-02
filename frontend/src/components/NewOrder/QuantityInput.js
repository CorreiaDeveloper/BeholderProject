import React, { useMemo, useRef } from 'react';

/**
 * props:
 * - id
 * - text
 * - wallet
 * - price
 * - symbol
 * - side
 * - onChange
 */
function QuantityInput(props) {

    const inputQuantity = useRef('');

    function onCalcClick(event) {
        if (!props.wallet || !Array.isArray(props.wallet)) return;

        let qty;

        if (props.side === 'SELL') {
            const baseAsset = props.wallet.find(w => w.symbol === props.symbol.base);
            if (!baseAsset) return;
            
            qty = parseFloat(baseAsset.available);
        } else {

            const quoteAsset = props.wallet.find(w => w.symbol === props.symbol.quote);
            if (!quoteAsset) return;

            const quoteAmount = parseFloat(quoteAsset.available);
            if (!quoteAmount) return;

            qty = quoteAmount / parseFloat(props.price);
        }

        if (!qty) return;

        inputQuantity.current.value = `${qty}`.substring(0, 8);
        if (props.onChange)
            props.onChange({ target: { id: props.id, value: inputQuantity.current.value } });
    }

    const quantityInput = useMemo(() => (
        <div className="form-group">
            <label htmlFor={props.id}>{props.text}</label>
            <div className="input-group">
                <button type="button" className="btn btn-secondary d-inline-flex align-items-center" onClick={onCalcClick}>
                    <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                </button>
                <input type="number" id={props.id} ref={inputQuantity} className="form-control" placeholder={props.symbol.minLotSize} onChange={props.onChange} />
            </div>
        </div>
    ), [props.wallet, props.price, props.symbol, props.side])

    return quantityInput;

}

export default QuantityInput;