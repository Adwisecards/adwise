import React from 'react'
import OperationItem from '../OperationItems/OperationItem'
import OperationStatistic from '../OperationItems/OperationStatistic'


function OperationList() {
    return (
        <div className='client__list'>
            <div className='cbox__table cbox__table_clients'>
                <div className='cbox__thead'>
                    <div className='cbox__thead-item cbox__thead-item_time'>
                        Дата
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_types'>
                        Тип
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_clients'>
                        Клиент
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_level'>
                        Уровень
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_cashief'>
                        Кассир
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_points'>
                        Баллы
                    </div>
                    <div className='cbox__thead-item cbox__thead-item_val'>
                        ₽
                    </div>
                </div>
                <div className='cbox__tbody'>
                    <OperationItem />
                </div>
            </div>
            <OperationStatistic />
        </div>
    );
}

export default OperationList;