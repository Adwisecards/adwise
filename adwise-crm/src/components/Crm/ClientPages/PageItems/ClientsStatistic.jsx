import React from 'react'



function ClientsStatistic() {

    return (
        <div className='cbox__statistic'>
            <div className='statistic__title'>
                Статистика
            </div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Всего клиентов
            </div>
                <div className='statistic__text'>
                    912 <span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Совершали покупки
                </div>
                <div className='statistic__text'>
                    912 <span>(100%)</span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Оплачено баллами
                </div>
                <div className='statistic__text'>
                    352 <span>(39%)</span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Оплатили, ₽
            </div>
                <div className='statistic__text'>
                    2 052 837,35<span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Оплатили баллами
                </div>
                <div className='statistic__text'>
                    99 239,25 <span></span>
                </div>
            </div>
            <div className='hr'></div>
            <div className='statistic__item'>
                <div className='statistic__sub-title'>
                    Баллы клиентов
                </div>
                <div className='statistic__text'>
                    91 268,60 <span></span>
                </div>
            </div>
        </div>
    );
}

export default ClientsStatistic;