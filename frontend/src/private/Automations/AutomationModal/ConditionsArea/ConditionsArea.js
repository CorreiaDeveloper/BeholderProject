import React, { useState, useEffect } from "react";
import IndexSelect from "./indexSelect";


/**
 * props:
 * - indexes
 * - symbol
 * - conditions
 * - onChange
*/
function ConditionsArea(props) {

    const [indexes, setIndexes] = useState([]);

    function onKeySelectChange(event) {
        console.log(event);
    }

    useEffect(() => {
        setIndexes(props.indexes);
    }, [props.indexes])

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 mb-3">
                    <IndexSelect indexes={indexes} onChange={onKeySelectChange} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default ConditionsArea;