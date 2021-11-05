import React from 'react'



function OperationStatistic() {

    return (
        <div className='cbox__statistic cbox__statistic_operation'>
            <div className='statistic__title'>
                Статистика
            </div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Общий счёт
            </div>
                <div className='statistic__text'>
                    249 184 <span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Сумма скидок
                </div>
                <div className='statistic__text'>
                    0 <span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Оплачено баллами
                </div>
                <div className='statistic__text'>
                    10 687<span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Оплачено
            </div>
                <div className='statistic__text'>
                    238 497<span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Фактическая скидка
                </div>
                <div className='statistic__text'>
                    10 687 <span></span>
                </div>
            </div>
        </div>
    );
}

export default OperationStatistic;