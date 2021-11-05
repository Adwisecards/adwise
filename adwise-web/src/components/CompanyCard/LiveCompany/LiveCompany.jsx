import React from 'react';
import LivePromo from './LivePromo';

function LiveCompany() {
    return (
        <div className='live-company'>
            <h2 className='extange__h2 box__h2_section'>Жизнь компании</h2>
            <div className='box_live-promo'>
                <LivePromo />
            </div>

            <div className='slider__arrow_right slider__arrow_right-live'>
                <img src={'/img/arrow-right.svg'} alt="arrow-right" />
            </div>
        </div>
    )
}

export default LiveCompany
