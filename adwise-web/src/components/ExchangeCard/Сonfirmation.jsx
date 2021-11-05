import React from 'react';

function Сonfirmation() {
    return (
        <div className='box extange__box_confirmation'>
            <h2 className='extange__h2 extange__h2_confirmation'>Получить ссылку на скачивание</h2>
            <div className='extange__confirmation'>
                <label className='extange__label' htmlFor='form__name'>Телефон
                    <input
                        type='number'
                        required
                        placeholder='89001234567'
                        id='form__name' />
                </label>
                <button className='button extange__button_confirmation'>Отправить</button>
            </div>
        </div>
    )
}

export default Сonfirmation