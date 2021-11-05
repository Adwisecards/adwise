import React from 'react'
import './Crm.css'
import CrmClients from './ClientPages/CrmClients'
import { Route, Switch } from "react-router-dom";
import CrmOperation from './OpertionPages/CrmOperation'
import ClientDesc from './ClientPages/ClientList/ClientDesc'
import CrmHeader from './CrmItems/CrmHeader';
import CrmSideBar from './CrmItems/CrmSideBar';
import iconExit from '../../main/assets/img/background.png'



function CrmPage() {
    return (
        <div className='background background__crm' style={{
            backgroundImage: `url(${iconExit})`,
            backgroundPosition: 'center',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className='c-container'>
                <CrmHeader />
                <div className='cbox-main'>
                    <CrmSideBar />
                    <Switch>
                        <Route exact path='/' component={CrmClients} />
                        <Route exact path='/clients' component={CrmClients} />
                        <Route path='/clients/:id' render={ClientDesc} />
                        <Route path='/operation' component={CrmOperation} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default CrmPage;
