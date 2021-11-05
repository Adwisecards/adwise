import React, { useState } from 'react';
import Registration from '../registration/Registration';
import OnLoginContainer from './OnLoginContainer';



function OnLogin({ changeAuth }) {
    const [regitrationPage, setRegitrationPage] = useState(false);
    function onRegistration() {
        setRegitrationPage(true)
    }

    return (
        <React.Fragment>
            {!regitrationPage
                ? (<OnLoginContainer onRegistration={() => onRegistration()} changeAuth={() => changeAuth()} />)
                : <Registration changeAuth={() => changeAuth()} />
            }


        </React.Fragment>
    )
}

export default OnLogin