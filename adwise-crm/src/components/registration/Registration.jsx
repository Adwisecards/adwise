import React, { useState } from 'react';
import './Registration.css'
import UserForm from './UserRegistration/UserForm';
import CompanyForm from './CompanyRegistration/CompanyForm';
import axios from 'axios';


function Registration({ changeAuth }) {
    const [user, setUser] = useState(null);
    function changeUser(u) {
        setUser(u)
    }
    function changeUserCompany(org) {
        const obj = {
            organization: org,
            user: user,
        }
        onReg(obj)
    }
    const onReg = async (obj) => {
        await axios.post('https://adwise-dev.wise.win/v1/crm/create-user-organization', obj)
        changeAuth()
    }
    return (
        <div className='background' style={{
            backgroundImage: "url(./img/background.png)",
            // backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }}>
             <CompanyForm changeUserCompany={changeUserCompany} />
        </div>
    )
}

export default Registration
