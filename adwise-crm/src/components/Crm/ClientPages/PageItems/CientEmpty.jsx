import React from 'react'
import clientEmpty from '../../../../main/assets/img/client-empty.svg'


function CientEmpty() {

    return (
        <div className='cbox__main-item cbox__main-item_empty'>
            <img src={clientEmpty} alt="client-empty" />
            <div className='cbox__main-title'>
                Ваши клиенты будут здесь!
            </div>
            <div className='cbox__main-text'>
                Разместите информацию о программе лояльности в вашем заведении,
                для этого скачайте и распечатайте тейбл тент
            </div>
            <div className='cbox__button cbox__main-button'>
                Скачать
            </div>
        </div>
    );
}

export default CientEmpty;