import React from 'react';

/**
 * props:
 * -id
 * - text
 * - onClick
 */
function SmartBadge(props) {
    return (
        <div className="input-group me-2 d-flex flex-row flex-nowrap">
            <span id="spanNoWrap" className="alert alert-info py-1">
                {props.text}
            </span>
            <button type="button" id={props.id} className="btn btn-info btn-xs alert" title="Click to Remove" onClick={props.onClick}>
                X
            </button>
        </div>
    )
}

export default SmartBadge;