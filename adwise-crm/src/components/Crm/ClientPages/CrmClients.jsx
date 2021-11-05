import React from 'react'
import ClientList from './ClientList/ClientList'
import axios from 'axios'
import magnifier from '../../../main/assets/img/magnifier.svg'
import excel from '../../../main/assets/img/excel.svg'
import filter from '../../../main/assets/img/filter.svg'
// import Referal from './Referal'
// import ClientEmpty from './ClientPages/CientEmpty'

function CrmClients() {
    const getClients = async () => {
        await axios
            .get('http://adwise-dev.wise.win:5000/v1/organizations/get-clients/5f97b7fa1c2bf126063b8daa?limit=10&page=1', {
                withCredentials: true
            })
            .then(response => (console.log(response)))
    }
    return (
        <div className='cbox cbox-content'>
            <div className='cbox-content__main'>
                <div className='cbox__header_content'>
                    <div className='cbox__title_content'>
                        <div className='cbox__h2'>Клиенты</div>
                        <div className='cbox__h2-count box__button_content'>
                            0
                        </div>
                    </div>
                    <div
                        className='cbox__header-icons'
                    >
                        <img
                            className='cbox__header-icons-item'
                            src={magnifier}
                            alt="magnifier"
                        />
                        <img
                            className='cbox__header-icons-item'
                            src={excel}
                            alt="excel"
                        />
                        <div
                            className='box__button_content
                        box__button_content-p
                        box__button_content-bd
                        cbox__header-icons-item'
                        >
                            Дни рождения
                    </div>
                    </div>
                </div>
                <div className='cbox__filter'>
                    <div
                        className='cbox__button cbox__button_sm'
                        onClick={() => getClients()}
                    >
                        <img src={filter} alt="filter" />
                    </div>
                    <div></div>
                </div>
                <div className='cbox__main'>
                    {/* <ClientEmpty /> */}
                    <ClientList />

                </div>
            </div>
            {/* <Referal /> */}

        </div>

    );
}

export default CrmClients;