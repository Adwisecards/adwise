import React, { useState, useEffect, useRef } from 'react';
import CompanyAdress from './CompanyAdress';
import CompanyExample from './CompanyExample';


function CompanyForm({ changeUserCompany }) {
    const [company, setCompany] = useState('');
    const [annotation, setAnnotation] = useState('');
    const [addTag, setAddTag] = useState('');
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState('Выберите категорию');
    const [ul, setUl] = useState(false);
    const [adress, setAdress] = useState('');
    const [addPhone, setAddPhone] = useState('');
    const [phones, setPhones] = useState([]);
    const [addEmail, setAddEmail] = useState('');
    const [emails, setEmails] = useState([]);


    const [next, setNext] = useState(false)
    const [nextPage, setNextPage] = useState(false)
    const ulRef = useRef(null)
    const boxUlRef = useRef(null)
    function useOutsideAlerter(ref, secRef) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target) && secRef.current && !secRef.current.contains(event.target)) {
                    setUl(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, secRef]);
    }

    function changePhones() {
        if (addPhone !== '' && phones.length < 3) {
            setPhones([...phones, addPhone])
            setAddPhone('')
        }
    }
    function removePhones(idx) {
        setPhones(phones.filter((t, i) => i !== idx))
    }
    function changeEmails() {
        if (addEmail !== '' && emails.length < 3) {
            setEmails([...emails, addEmail])
            setAddEmail('')
        }
    }
    function removeEmails(idx) {
        setEmails(emails.filter((t, i) => i !== idx))
    }

    useOutsideAlerter(ulRef, boxUlRef)
    function changeSelect(target) {
        setCategory(target)
        setUl(!ul)
    }
    function changeTags() {
        if (addTag !== '' && tags.length < 3) {
            setTags([...tags, addTag])
            setAddTag('')
        }
    }
    function removeTags(idx) {
        setTags(tags.filter((t, i) => i !== idx))
    }
    function adressRegistration() {
        setNextPage(!nextPage)
    }
    const continueRegistration = () => {
        let organization = {
            briefDescription: annotation,
            name: company,
            categoryId: '5f97c75eaac576bce20b28b6',
            tags: tags.join(','),
            placeId: "ChIJ1XdMZHxuwUMR2yjuTi0hPDw",
            phones: phones.join(','),
            emails: emails.join(','),
        }
        changeUserCompany(organization)
    }

    useEffect(() => {
        if (company !== '' && annotation !== '' && tags.length !== 0 && category !== 'Выберите категорию') {
            setNext(true)
        } else {
            setNext(false)
        }
    }, [company, annotation, tags, category])
    return (
        <React.Fragment>
            <div className='rbox rbox__logo_second-page rbox__logo_second-page-company'><img src={'img/logo.svg'} alt="logo" className='extange__logo' /></div>
            <div className='button button__opacity'>Возникли вопросы?</div>
            <div className='rbox__demo'>
                <h5 className='rbox__demo-title'>Не хотите заполнять?</h5>
                <p className='rbox__demo-text'>Мы специально заполнили данные за вас, чтобы вам было проще понять как работает наш сервис.</p>
                <div className='button button__demo'>Открыть демо-компанию</div>
            </div>
            <div className='rbox__container rbox__container__company'>
                <h1 className='rbox__title'>Регистрация компании</h1>
                <div className='rbox__nav'>
                    <div className='rbox__link rbox__link_active'>
                        <div className='rbox__link_number'>1</div>
                        <p className='rbox__link_text'>Информация о компании</p>
                    </div>
                    <div className='rbox__link'>
                        <div className='rbox__link_number'>2</div>
                        <p className='rbox__link_text'>Помогите вашему клиенту найти вас</p>
                    </div>
                </div>
                <div className='rbox__content'>
                    <div className='rbox rbox__company-1'>
                        <div className='rbox__inputs'>
                            <label className='rbox__label rbox__label_comp rbox__label_company' htmlFor='form__company'>Название
                                <input
                                    disabled={nextPage}
                                    type='company'
                                    value={company}
                                    onChange={(e) => { setCompany(e.target.value) }}
                                    id='form__company' />

                            </label>
                            <p className='rbox__label_p'>Несколько слов о вашей компании</p>
                            <label className='rbox__label rbox__label_comp' htmlFor='annotation'>Аннотация
                            <textarea
                                    id='annotation'
                                    disabled={nextPage}
                                    className='rbox__textarea'
                                    value={annotation}
                                    onChange={(e) => { setAnnotation(e.target.value) }}
                                />

                            </label>
                            <p className='rbox__label_p'>Указывается без правовой формы</p>
                            <label className='rbox__label_select ' htmlFor="form__category">Категория
                            <div className="customselect">
                                    <button disabled={nextPage} ref={boxUlRef} onClick={() => { setUl(!ul) }} className="title">{category}
                                        {!ul
                                            ? (<img src={"img/vector-down2.svg"} alt="vector-down" className='customselect__arrow' />)
                                            : (<img src={"img/vector-down2.svg"} alt="vector-down" className='customselect__arrow customselect__arrow_active-db' />)
                                        }
                                    </button>
                                    {ul ? (<ul ref={ulRef} className='select-ul select-ul_category'>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }} >Рестораны и кафе</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Развлечения</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Магазины</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Красота и здоровье</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Услуги</li>
                                    </ul>) : null}
                                </div>

                            </label>
                            <label className='rbox__label rbox__label_comp' htmlFor='form__tag'>Теги
                                <div className='rbox__tag_element'>
                                    <input
                                        disabled={nextPage}
                                        type='text'
                                        value={addTag}
                                        onChange={(e) => { setAddTag(e.target.value) }}
                                        id='form__tag' />
                                    <button disabled={nextPage} onClick={changeTags} className='rbox__tag-push'>+</button>
                                </div>
                                {tags.map((tag, idx) =>
                                    <div className='rbox__tag_element' key={idx}>
                                        <input
                                            disabled
                                            value={tag}
                                            type='text' />
                                        <button disabled={nextPage} onClick={() => removeTags(idx)} className='rbox__tag-push'>-</button>
                                    </div>
                                )}
                            </label>
                            <p className='rbox__label_p'>Добавите 1—3 и более тегов связанных с деятельностью вашей компании</p>
                        </div>
                        <div className='rbox__success'>
                            {!next
                                ? (<button disabled className='button button__company button__disabled' >Продолжить</button>)
                                : (<button onClick={adressRegistration} className='button button__company'>{!nextPage ? 'Продолжить' : 'Изменить'}</button>)
                            }


                            <p className='rbox__success-p'>
                                Заполненные данные можно изменить послe регистрации
                            </p>
                        </div>
                    </div>
                    {!nextPage
                        ? (<CompanyExample company={company} annotation={annotation} />)
                        : (<CompanyAdress
                            adress={adress}
                            setAdress={setAdress}
                            addPhone={addPhone}
                            setAddPhone={setAddPhone}
                            phones={phones}
                            setPhones={setPhones}
                            addEmail={addEmail}
                            emails={emails}
                            setEmails={setEmails}
                            setAddEmail={setAddEmail}
                            continueRegistration={continueRegistration}
                            changePhones={changePhones}
                            removePhones={removePhones}
                            changeEmails={changeEmails}
                            removeEmails={removeEmails}
                        />)
                    }


                </div>
            </div>
        </React.Fragment >
    )
}

export default CompanyForm
