import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { getSettings } from '../../services/SettingsService';
import { doLogout } from '../../services/AuthService'
import Menu from '../../components/Menu/Menu'

function Settings() {
    const history = useHistory();

    const [error, setError] = useState('');

    const [settings, setSettings] = useState({
        email: '',
        apiUrl: '',
        accessKey: '',
        keySecret: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token');

        getSettings(token)
            .then(response => {
                setSettings(response);
            })
            .catch(err => {
                if (err.response && err.response.status === 401)
                    return history.push('/');

                if (err.response)
                    setError(err.response.data);
                else
                    setError(err.message);
            });
    }, [])

    return (
        <React.Fragment>
            <Menu />
        </React.Fragment>
    )
}

export default Settings;