import React, { useState, useRef, useEffect } from 'react';
import SmartBadge from '../../../components/SmartBadge/SmartBadge';

/**
 * props:
 * - indexes
 * - onChange
 */
function MonitorIndex(props) {

    const btnAddIndex = useRef('');
    const selectIndex = useRef('');
    const inputPeriod = useRef('');

    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        if (props.indexes) {
            setIndexes(props.indexes.split(','));
        }
        else setIndexes([]);
    }, [props.indexes])

    function onAddIndexClick(event) {
        const value = selectIndex.current.value;
        if (value !== 'NONE' && indexes.indexOf(value) === -1) {
            inputPeriod.current.value = inputPeriod.current.value === 'params' ? '' : inputPeriod.current.value;
            indexes.push(value + '_' + inputPeriod.current.value.split(',').join('_'));

            selectIndex.current.value = "NONE";
            inputPeriod.current.value = "";

            setIndexes(indexes);
            if (props.onChange) props.onChange({ target: { id: 'indexes', value: indexes.join(',') } });
        }
    }

    function btnRemoveIndex(event) {
        const id = event.target.id.replace('ix', '');
        const pos = indexes.findIndex(ix => ix === id);
        indexes.splice(pos, 1);
        setIndexes(indexes);
        if (props.onChange) props.onChange({ target: { id: 'indexes', value: indexes.join(',') } });
    }

    function onIndexChange(event) {
        switch (event.target.value) {
            case 'EMA':
            case 'SMA':
            case 'RSI': inputPeriod.current.placeholder = 'period'; break;
            case 'BB': inputPeriod.current.placeholder = 'period,stdDev'; break;
            case 'SRSI': inputPeriod.current.placeholder = 'd,k,rsi,stoch'; break;
            case 'MACD': inputPeriod.current.placeholder = 'fast,slow,signal'; break;
            default: break;
        }
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="form-group">
                        <label htmlFor="side">Indexes: <span data-bs-toggle="tooltip" data-bs-placement="top" title='The index params in parenthesis must be provided.' className='badge bg-warning py-1'>?</span></label>
                        <div className="input-group input-group-merge">
                            <select id="indexes" ref={selectIndex} className="form-select" defaultValue="NONE" onChange={onIndexChange}>
                                <option value="NONE">None</option>
                                <option value="BB">Bollinger Bands - (Period and Standard Deviation)</option>
                                <option value="EMA">EMA - (Period)</option>
                                <option value="MACD">MACD - (Fast, Slow and Signal Periods)</option>
                                <option value="RSI">RSI - (Period)</option>
                                <option value="SMA">SMA - (Period)</option>
                                <option value="SRSI">Stoch RSI (D, K, Rsi And Stochastic Periods)</option>
                            </select>
                            <input ref={inputPeriod} type="text" id="params" placeholder='params' className='form-control' required={true} />
                            <button type="button" className="btn btn-secondary" ref={btnAddIndex} onClick={onAddIndexClick}>
                                <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-inline-flex align-content-start">
                {
                    indexes.map(ix => (
                        <SmartBadge key={ix} id={"ix" + ix} text={ix} onClick={btnRemoveIndex} />
                    ))
                }
            </div>
        </React.Fragment>
    );
}

export default MonitorIndex;