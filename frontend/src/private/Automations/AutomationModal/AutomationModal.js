import React, { useEffect, useRef, useState } from 'react';
import SelectSymbol from '../../../components/SelectSymbol/SelectSymbol';
import ConditionsArea from './ConditionsArea/ConditionsArea';
import ActionsArea from './ActionsArea/ActionsArea';
import SwitchInput from '../../../components/SwitchInput/SwitchInput';
import { saveAutomation } from '../../../services/AutomationsServices';

/**
 * props:
 * - data
 * - onSubmit
*/
function AutomationModal(props) {

    const [indexes, setIndexes] = useState([]);
    const [error, setError] = useState('');
    const [automation, setAutomation] = useState({
        conditions: '',
        name: '',
        indexes: ''
    });

    const btnClose = useRef('');
    const btnSave = useRef('');

    function onSubmitClick(event) {
        const token = localStorage.getItem('token');
        saveAutomation(automation.id, automation, token)
            .then(result => {
                btnClose.current.click();
                if (props.onSubmit) props.onSubmit(result);
            })
            .catch(err => {
                console.error(err.responde ? err.response.data : err.message);
                setError(err.responde ? err.response.data : err.message);
            })
    }

    function onInputChange(event) {
        setAutomation(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    useEffect(() => {
        setAutomation(props.data);
    }, [props.data.id])


    useEffect(() => {
        if(!automation || !automation.symbol) return;

        const token = localStorage.getItem('token');
    }, [automation.symbol])

    return (
        <div className='modal fade' id="modalAutomation" tabIndex="-1" role='dialog' aria-labelledby='modalTitleNotify' aria-hidden="true">
            <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content'>
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">{props.data.id ? 'Edit ' : 'New '}Automation</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className='modal-body'>
                        <div className='form-group'>
                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor='symbol'>Symbol:</label>
                                    <SelectSymbol onChange={onInputChange} symbol={automation.symbol} onlyFavorites={false} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='row'>
                                <div className='col-md-12 mb-3'>
                                    <label htmlFor='name'>Name:</label>
                                    <input type="text" className='form-control' id="name" placeholder='My strategy name' defaultValue={automation.name} required={true} onChange={onInputChange}></input>
                                </div>
                            </div>
                        </div>
                        <ul className='nav nav-tabs' id="tabs" role='tablist'>
                            <li className='nav-item' role='presentation'>
                                <button className='nav-link active' id="conditions-tab" data-bs-toggle="tab" data-bs-target="#conditions" type="button" role="tab" aria-controls="conditions" aria-selected="true">
                                    Conditions
                                </button>
                            </li>
                            <li className='nav-item' role='presentation'>
                                <button className='nav-link' id="actions-tab" data-bs-toggle="tab" data-bs-target="#actions" type="button" role="tab" aria-controls="actions" aria-selected="true">
                                    Actions
                                </button>
                            </li>
                        </ul>
                        <div className='tab-content px-3 mb-3' id="tabContent">
                            <div className='tab-pane fade show active pt-3' id="conditions" role='tabpanel' aria-labelledby='conditions-tab'>
                                <ConditionsArea indexes={indexes} conditions={automation.conditions} onChange={onInputChange} symbol={automation.symbol} />
                            </div>
                            <div className='tab-pane fade' id="actions" role='tabpanel' aria-labelledby='actions-tab'>
                                <ActionsArea />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb3">
                                <div className="form-group">
                                    <SwitchInput id="isActive" text="Is Active?" onChange={onInputChange} isChecked={automation.isActive} />
                                </div>
                            </div>
                            <div className="col-md-6 mb3">
                                <div className="form-group">
                                    <SwitchInput id="logs" text="Has Logs?" onChange={onInputChange} isChecked={automation.logs} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        {
                            error
                                ? <div className='alert alert-danger mt-1 col-9 py-1'>{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                        <button ref={btnSave} type="button" className='btn btn-sm btn-primary' onClick={onSubmitClick}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AutomationModal;