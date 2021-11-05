import React from 'react';
import Promo from './Promo';
import Registration from './Registration';
import Сonfirmation from './Сonfirmation';

function ExtangeCard() {
    return (
        <div className='container container__extange'>
            <div className='ExtangeCard'>
                <Promo />
                <Registration />
                <Сonfirmation />

            </div>
            <p className='copyright__p'>
            Продолжая, я подтверждаю, что ознакомлен с <a href='https://adwise-web-dev.wise.win/privacy-policy' target="_blank">Политикой конфиденциальности</a>,
            <a href='https://adwise-web-dev.wise.win/user-agreement' target="_blank"> Пользовательским соглашением</a> и принимаю их условия
            </p>
            <p className='copyright__p'>
                AdWise 2020. Все работы, представленные на данном сайте, выполнены сотрудниками Adwise и защищены законодательством об авторском праве.
            </p>
        </div>
    )
}

export default ExtangeCard