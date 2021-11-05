import React from 'react'
import logoCrm from '../../../main/assets/img/logo-crm.svg'
import logoTextCrm from '../../../main/assets/img/logo-text-crm.svg'
import iconBonus from '../../../main/assets/img/icon-bonus.svg'
import iconNotification from '../../../main/assets/img/icon-notification.svg'
import iconProfile from '../../../main/assets/img/icon-profile.svg'
import iconRus from '../../../main/assets/img/icon-rus.svg'
import iconExit from '../../../main/assets/img/icon-exit.svg'

function CrmHeader() {

    return (

        <div className='cbox__header'>
            <div className='cbox cbox__logo'>
                <img src={logoCrm} alt="logo" />
                <img src={logoTextCrm} alt="logo-text" />
            </div>
            <div className='cbox cbox__item'>
                <img src={iconBonus} alt="icon-bonus" />
            </div>
            <div className='cbox cbox__item'>
                <img src={iconNotification} alt="icon-notification" />
            </div>
            <div className='cbox cbox__item'>
                <img src={iconProfile} alt="icon-profile" />
                <p>Личный кабинет</p>
            </div>
            <div className='cbox cbox__item'>
                <img src={iconRus} alt="icon-rus" />
                <p>Русский</p>
            </div>
            <div className='cbox cbox__item'>
                <img src={iconExit} alt="icon-exit" />
                <p>Выход</p>
            </div>
        </div>

    );
}

export default CrmHeader;