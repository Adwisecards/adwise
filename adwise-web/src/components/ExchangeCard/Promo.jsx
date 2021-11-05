import React from 'react';

function Promo() {
    return (

        <div className='box extange__box_promo'>
            <img src={'/img/logo.svg'} alt="logo" className='extange__logo' />
            <div className='extangePromo__content'>
                <p className='extange__p'>Рекомендуйте и получайте кэшбэк со всех покупок вашего окружения. Зарегистрируйтесь и установите приложение прямо сейчас!</p>
                <div className='extange__content'>
                    <img src={'/img/globe.svg'} alt="globe" id='globe' />
                    <h5 className='extange__h5'>adwise.cards</h5>
                    <div className='extange__vr'></div>
                    <div className='extange__social-networks'>
                        <i className="box__icons box__icons_extange fab fa-facebook-f"></i>
                        <i className="box__icons box__icons_extange fab fa-instagram"></i>
                        <i className="box__icons box__icons_extange fab fa-youtube"></i>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Promo
