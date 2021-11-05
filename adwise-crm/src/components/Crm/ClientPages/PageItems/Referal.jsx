import React from 'react'
import referalImg from '../../../../main/assets/img/referal-img.svg'


function Referal() {

    return (
        <div className='cbox__referal'>
            <img src={referalImg} alt="referal-img" />
            <div className='referal__title'>
                Самое время рассказать вашим клиентам о приложении
            </div>
            <div className='referal__text'>
                Разместите в ваших соцсетях информацию о AdWise и
                ссылку на присоединение, так ваши клиенты быстрее
                попадут к вам в базу!
            </div>
            <input
                className='referal__input'
                type="text" />
            <div
                className='box__button_content
                        box__button_content-p
                        box__button_content_referal
                        cbox__header-icons-item'
            >
                Скопировать ссылку
            </div>
        </div>
    );
}

export default Referal;