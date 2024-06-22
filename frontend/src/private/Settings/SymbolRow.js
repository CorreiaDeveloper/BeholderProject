import React from "react";

function SymbolRow(props) {
    return (
        <tr>
            <td className="text-gray-900">
                {props.data.symbol}
                {props.data.isFavorite
                    ? <svg className="icon icon-xs" stroke="orange" data-slot="icon" fill="yellow" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <path clipRule="evenodd" fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"></path></svg>
                    : <React.Fragment></React.Fragment>
                }
            </td>
            <td className="text-gray-900">
                {props.data.basePrecision}
            </td>
            <td className="text-gray-900">
                {props.data.quotePrecision}
            </td>
            <td className="text-gray-900">
                {props.data.minNotional}
            </td>
            <td className="text-gray-900">
                {props.data.minLotSize}
            </td>
            <td>
                <button id={"edit" + props.data.symbol} className="btn btn-secondary animate-up-2" width={32}>
                    <svg id={"edit" + props.data.symbol} className="icon icon-xs" data-slot="icon" stroke="black" fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"></path><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"></path></svg>
                </button>
            </td>
        </tr>
    );
}

export default SymbolRow;