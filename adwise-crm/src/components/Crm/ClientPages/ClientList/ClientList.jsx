import React from 'react'
import ClientsStatistic from '../PageItems/ClientsStatistic';
import ClientItem from './ClientItem'

function ClientList() {
    return (
        <div className='client__list'>
            <div className='cbox__table cbox__table_clients'>
                <div className='cbox__thead'>
                    <div className='cbox__thead-item cbox__thead-item_client'>
                        Клиент
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_recomend'>
                        Рекомендации
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_scores'>
                        Остаток баллов
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_paid'>
                        Оплачены, ₽
                    </div>
                </div>
                <div className='cbox__tbody'>
                    <ClientItem />
                </div>
            </div>
            <ClientsStatistic />
        </div>
    );
}

export default ClientList;