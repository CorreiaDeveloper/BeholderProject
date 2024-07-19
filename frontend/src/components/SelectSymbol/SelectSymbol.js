import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getSymbols } from '../../services/SymbolsService';

/**
 * 
 * props:
 * - onlyFavorites
 * - disabled
 * - onChange 
 */
function SelectSymbol(props) {

    const [symbols, setSymbols] = useState(["LOADING"])
    const [onlyFavorites, SetOnlyFavorites] = useState(props.onlyFavorites === null || props.onlyFavorites === undefined ? true : props.onlyFavorites)

    const selectRef = useRef('');
    const buttonRef = useRef('');

    useEffect(() => {
        selectRef.current.value = props.symbol || 'BTCUSDT';
        buttonRef.current.disabled = selectRef.current.disabled = props.disabled;
    }, [props.symbol])

    useEffect(() => {
        const token = localStorage.getItem('token');
        getSymbols(token)
            .then(symbolObjects => {
                const symbolNames = onlyFavorites
                    ? symbolObjects.filter(s => s.isFavorite).map(s => s.symbol)
                    : symbolObjects.map(s => s.symbol)

                if (symbolNames.length) {
                    setSymbols(symbolNames);
                    selectRef.current.value = symbolNames[0];
                    props.onChange({ target: { id: 'symbol', value: symbolNames[0] } });
                } else setSymbols(["NO SYMBOLS"])
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setSymbols(["ERROR"]);
            })
    }, [onlyFavorites]);

    useEffect(() => {
        selectRef.current.value = props.symbol;
    }, [props.symbol])

    function onFavoriteClick() {
        SetOnlyFavorites(!onlyFavorites)
    }

    function getStarFillColor() {
        return onlyFavorites ? "yellow" : "white";
    }

    const selectSymbol = useMemo(() => {
        return (
            <div className='input-group'>
                <button ref={buttonRef} type='button' className='btn btn-secondary d-inline-flex align-items-center' onClick={onFavoriteClick}>
                    <svg className="icon icon-xs" data-slot="icon" fill={getStarFillColor()} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={onFavoriteClick} aria-hidden="true">  <path clipRule="evenodd" fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"></path></svg>
                </button>
                <select ref={selectRef} id="symbol" className='form-select' onChange={props.onChange}>
                    {symbols.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
            </div>
        )
    }, [symbols])

    return (
        selectSymbol
    );
}

export default SelectSymbol;