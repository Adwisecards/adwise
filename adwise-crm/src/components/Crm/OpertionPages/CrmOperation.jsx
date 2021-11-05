import React from 'react'
import OperationList from './OperationList/OperationList'
import filter from '../../../main/assets/img/filter.svg'

function CrmOperation() {
    return (
        <div className='cbox cbox-content'>
            <div className='cbox-content__main'>
                <div className='cbox__header_content'>
                    <div className='cbox__title_content'>
                        <div className='cbox__h2'>Операции</div>
                        <div className='cbox__h2-count box__button_content'>
                            0
                        </div>
                    </div>
                    <div className='cbox__header-icons'>
                    </div>
                </div>
                <div className='cbox__filter'>
                    <div
                        className='cbox__button cbox__button_sm'
                    >
                        <img src={filter} alt="filter" />
                    </div>
                    <div></div>
                </div>
                <div className='cbox__main'>
                    <OperationList />
                </div>
            </div>
        </div>

    );
}

export default CrmOperation;