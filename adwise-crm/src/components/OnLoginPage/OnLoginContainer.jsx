import React, { useState } from 'react';
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'


function OnLoginContainer({ changeAuth, onRegistration }) {
    const [poap, setPoap] = useState(false);
    const validationSchema = yup.object().shape({
        email: yup.string().typeError('Должна быть строка').required('Поле обязательно').email('Форматы почты: mail@mail.com, mail@mail.mail.com'),
        password: yup.string().typeError('Должна быть строка').required('Поле обязательно').min(6, 'Пароль должен быть больше 6 символов'),
    })
    const OnLogin = async (values) => {
        setPoap(false)
        await axios.post('https://adwise-dev.wise.win/v1/accounts/users/sign-in', {
            login: values.email,
            password: values.password,
        })
            .then(response => {
                localStorage.setItem('token', response.data.data.jwt)
                localStorage.setItem('userId', response.data.data.userId)
                changeAuth()
            })
            .catch(err => {
                setPoap(true)
            })
    }

    return (
        <div className='background' style={{
            backgroundImage: "url(./img/background.png)",
            backgroundSize: 'cover',
        }}>
            <div className='rbox__container rbox__container_first-form '>
                <div className='rbox rbox__first-reg rbox__first-reg_login'>
                    <div className='rbox rbox__logo_first-page rbox__logo-box'><img src={'img/logo.svg'} alt="logo" className='extange__logo' /></div>
                    <h1 className='rbox__title rbox__title_login'>Войти в аккаунт</h1>

                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validateOnBlur
                        onSubmit={(values) => { OnLogin(values) }}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => (
                            <div className='rbox__inputs'>
                                <label className={errors.email && touched.email ? 'rbox__label rbox__label_error' : 'rbox__label'} htmlFor='form__email'>Ваша почта
                            <input
                                        type={'text'}
                                        name='email'
                                        value={values.email}
                                        placeholder={`Ivan@mail.com`}
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
                                {!isValid
                                    ? (<button className='button button_first-page button__disabled' disabled={!isValid && !dirty} type={`submit`}>Войти</button>)
                                    : (<button className='button button_first-page' disabled={!isValid && !dirty} type={`submit`} onClick={handleSubmit}>Войти</button>)
                                }
                            </div>
                        )}
                    </Formik>
                    <p>Или <a className='registration__link' onClick={() => onRegistration()}>зарегистрируйтесь</a></p>
                    <img src={"img/people.png"} alt="people" className='rbox__people' />
                </div>
                <div className={poap ? 'poap' : 'poap poap__dn'}>Неверный пароль или логин</div>
            </div >
        </div>
    )
}

export default OnLoginContainer
