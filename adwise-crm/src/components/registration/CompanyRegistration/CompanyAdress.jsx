import React, { useState, useEffect } from 'react';

function CompanyAdress({ continueRegistration, adress, setAdress, addPhone, setAddPhone,
    phones, addEmail, setAddEmail, emails, changePhones, removePhones, changeEmails, removeEmails }) {
    const [next, setNext] = useState(false)

    useEffect(() => {
        if (adress !== '' && phones.length !== 0 && emails.length !== 0) {
            setNext(true)
        } else {
            setNext(false)
        }
    }, [adress, phones, emails])
    return (
        <div className='rbox rbox__map'>
            <img src="img/map.png" alt="map" />
            <div className='rbox__map-content'>
                <label className='rbox__label rbox__label_comp rbox__label_company' htmlFor='form__adress'>Адрес
                        <input
                        value={adress}
                        onChange={(e) => { setAdress(e.target.value) }}
                        type='company'
                        id='form__adress' />
                </label>
                <p className='rbox__label_p rbox__label_p-adress'>Можно указать адрес на карте</p>
                <div className='rbox__map-contact'>
                    <label className='rbox__label rbox__label_comp' htmlFor='form__phones'>Телефоны
                                <div className='rbox__tag_element'>
                            <input
                                type='tel'
                                value={addPhone}
                                onChange={(e) => { setAddPhone(e.target.value) }}
                                id='form__phones' />
                            <button onClick={changePhones} className='rbox__tag-push'>+</button>
                        </div>
                        {phones.map((phone, idx) =>
                            <div className='rbox__tag_element' key={idx}>
                                <input
                                    disabled
                                    value={phone}
                                    type='text' />
                                <button onClick={() => removePhones(idx)} className='rbox__tag-push'>-</button>
                            </div>
                        )}
                    </label>
                    <label className='rbox__label rbox__label_comp' htmlFor='form__emails'>Emails
                                <div className='rbox__tag_element'>
                            <input
                                type='email'
                                value={addEmail}
                                onChange={(e) => { setAddEmail(e.target.value) }}
                                id='form__emails' />
                            <button onClick={changeEmails} className='rbox__tag-push'>+</button>
                        </div>
                        {emails.map((email, idx) =>
                            <div className='rbox__tag_element' key={idx}>
                                <input
                                    disabled
                                    value={email}
                                    type='text' />
                                <button onClick={() => removeEmails(idx)} className='rbox__tag-push'>-</button>
                            </div>
                        )}
                    </label>
                </div>
                {!next
                    ? (<button className='button button__disabled button__map' disabled>Создать компанию</button>)
                    : (<button className='button button__map' onClick={continueRegistration}>Создать компанию</button>)}
            </div>
        </div>
    )
}

export default CompanyAdress