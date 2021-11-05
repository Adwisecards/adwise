import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik'
import * as yup from 'yup'

function UserForm({ changeUser }) {
    const [country, setCountry] = useState('Выберите страну');
    const [ul, setUl] = useState(false);
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
    useOutsideAlerter(ulRef, boxUlRef)
    function changeSelect(target) {
        setCountry(target)
        setUl(!ul)
    }


    const continueRegistration = (values) => {
        const user = {
            firstName: values.name,
            lastName: values.secondName,
            // userId: Date.now(),
            // email: email,
            // country: country,
            password: values.password,
            phone: `+7${values.phone.slice(1)}`,
        }
        changeUser(user)
    }

    const validationSchema = yup.object().shape({
        name: yup.string().typeError('Должна быть строка').required('Поле обязательно').min(2, 'Имя должно быть больше 2 символов'),
        secondName: yup.string().typeError('Должна быть строка').required('Поле обязательно').min(2, 'Фамилия должна быть больше 2 символов'),
        phone: yup.string().typeError('Должна быть строка').required('Поле обязательно').length(11, 'Телефон должен быть равен 11 символам').matches(/^\d+$/ig, 'Должны быть числа').matches(/^8/ig, 'Число должно начинаться на 8'),
        email: yup.string().typeError('Должна быть строка').required('Поле обязательно').email('Форматы почты: mail@mail.com, mail@mail.mail.com'),
        password: yup.string().typeError('Должна быть строка').required('Поле обязательно').min(6, 'Пароль должен быть больше 6 символов'),
        confirmPassword: yup.string().typeError('Должна быть строка').oneOf([yup.ref('password')], 'Пароли не совпадают').required('Поле обязательно').min(6, 'Фамилия должна быть больше 6 символов'),
        confidential: yup.boolean().oneOf([true], 'Галочка обязательна'),
        ofert: yup.boolean().oneOf([true], 'Галочка обязательна')
    })
    return (
        <div className='rbox__container rbox__container_first-form'>
            <div className='rbox rbox__first-reg'>
                <div className='rbox rbox__logo_first-page rbox__logo-box'><img src={'img/logo.svg'} alt="logo" className='extange__logo' /></div>
                <h1 className='rbox__title'>Создать аккаунт для своего бизнеса</h1>
                <h4 className='rbox__h4'>Бесплатный доступ к полному функционалу AdWise на 7 дней</h4>

                <Formik
                    initialValues={{
                        name: '',
                        secondName: '',
                        phone: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        ofert: false,
                        confidential: false,
                    }}
                    validateOnBlur
                    onSubmit={(values) => { continueRegistration(values) }}
                    validationSchema={validationSchema}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => (
                        <div className='rbox__inputs'>
                            <label className={errors.name && touched.name ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__name'>Имя
                            <input
                                    type={'text'}
                                    name='name'
                                    value={values.name}
                                    placeholder={`Иван`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__name' />
                                {touched.name && errors.name && <p className={'rbox__label_p-errors'}>{errors.name}</p>}
                            </label>
                            <label className={errors.secondName && touched.secondName ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__secname'>Фамилия
                            <input
                                    type={'text'}
                                    name='secondName'
                                    value={values.secondName}
                                    placeholder={`Иванов`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__secname' />
                                {touched.secondName && errors.secondName && <p className={'rbox__label_p-errors'}>{errors.secondName}</p>}
                            </label>
                            <label className={errors.phone && touched.phone ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__phone'>Телефон
                            <input
                                    type={'phone'}
                                    name='phone'
                                    value={values.phone}
                                    placeholder={`89123456789`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__phone' />
                                {touched.phone && errors.phone && <p className={'rbox__label_p-errors'}>{errors.phone}</p>}
                            </label>
                            <label className={errors.email && touched.email ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__email'>E-mail
                            <input
                                    type={'text'}
                                    name='email'
                                    value={values.email}
                                    placeholder={`mail@mail.com`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__email' />
                                {touched.email && errors.email && <p className={'rbox__label_p-errors'}>{errors.email}</p>}
                            </label>
                            <label className={errors.password && touched.password ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__password'>Пароль
                            <input
                                    type={'password'}
                                    name='password'
                                    value={values.password}
                                    placeholder={``}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__password' />
                                {touched.password && errors.password && <p className={'rbox__label_p-errors'}>{errors.password}</p>}
                            </label>
                            <label className={errors.confirmPassword && touched.confirmPassword ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__confirmPassword'>Подтвердите пароль
                            <input
                                    type={'password'}
                                    name='confirmPassword'
                                    value={values.confirmPassword}
                                    placeholder={``}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__confirmPassword' />
                                {touched.confirmPassword && errors.confirmPassword && <p className={'rbox__label_p-errors'}>{errors.confirmPassword}</p>}
                            </label>
                            <label className='rbox__label_select' htmlFor="form__country">Страна пребывания
                            <div className="customselect customselect__country">

                                    <button ref={boxUlRef} onClick={() => { setUl(!ul) }} className="title">{country}
                                        {!ul
                                            ? (<img src={"img/vector-down.svg"} alt="vector-down" className='customselect__arrow' />)
                                            : (<img src={"img/vector-down.svg"} alt="vector-down" className='customselect__arrow customselect__arrow_active' />)
                                        }
                                    </button>

                                    {ul ? (<ul ref={ulRef} className='select-ul'>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Российская федерация</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Казахстан</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Украина</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Китай</li>
                                        <li onClick={(e) => { changeSelect(e.target.innerText) }}>Польша</li>
                                    </ul>) : null}
                                </div>

                            </label>
                            <label htmlFor='form__confidentiality'
                                className={errors.confidential && touched.confidential
                                    ? 'rbox__label_checkbox rbox__label_checkbox-error'
                                    : 'rbox__label_checkbox'}
                            >
                                <input
                                    type={'checkbox'}
                                    name='confidential'
                                    value={values.confidential}
                                    onClick={handleChange}
                                    onBlur={handleBlur}
                                    id='form__confidentiality'
                                    className='rbox__checkbox'
                                />
                                <p>Я ознакомился с <a href='/#'>Политикой конфиденциальности</a> и принимаю ее условия</p>
                                {touched.confidential && errors.confidential &&
                                    <p className={'rbox__label_p-errors rbox__label_p-errors-check'}>{errors.confidential}</p>
                                }
                            </label>

                            <label htmlFor='form__proposes'
                                className={errors.ofert && touched.ofert
                                    ? 'rbox__label_checkbox rbox__label_checkbox-2 rbox__label_checkbox-error rbox__label_p-errors-check-2'
                                    : 'rbox__label_checkbox rbox__label_checkbox-2'}
                            >
                                <input
                                    type={'checkbox'}
                                    name='ofert'
                                    value={values.ofert}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='form__proposes'
                                    className='rbox__checkbox'
                                />
                                <p>Я ознакомился с <a href='/#'>Условия оферты</a></p>
                                {touched.ofert && errors.ofert &&
                                    <p className={'rbox__label_p-errors rbox__label_p-errors-check rbox__label_p-errors-check-p'}>{errors.ofert}</p>
                                }
                            </label><br></br><br></br>
                            {!isValid
                                ? (<button className='button button_first-page button__disabled' disabled={!isValid && !dirty} type={`submit`}>Продолжить регистрацию</button>)
                                : (<button className='button button_first-page' disabled={!isValid && !dirty} type={`submit`} onClick={handleSubmit}>Продолжить регистрацию</button>)
                            }
                        </div>
                    )}
                </Formik>
                <img src={"img/people.png"} alt="people" className='rbox__people' />
            </div>
        </div >
    )
}

export default UserForm
