import React from 'react';
import { useState } from 'react';
import {Formik} from 'formik';
import MyRegexp from 'myregexp';
import { actions } from '../../store';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';

function Registration({createUser, getMe, history, ref, location, signIn, verifyAccount}) {
    const [passwordShown, setPasswordShown] = useState(false);
    const [verification, setVerification] = useState(false);
    const [isRegistration, setIsRegistration] = useState(true);
    const [verificationId, setVerificationId] = useState('');

    const validationSchemaForSignUp = Yup.object().shape({
        firstName: Yup.string().min(1, 'Имя должно содержать как минимум одну букву').required('Введите имя'),
        emailOrPhone: Yup.string().matches(MyRegexp.emailOrPhone(), 'Введите номер телефона').required('Введите номер телефона'),
        password: Yup.string().min(6, 'Минимум 6 символов'),
    });

    const validationSchemaForSignIn = Yup.object().shape({
        login: Yup.string().matches(MyRegexp.emailOrPhone(), 'Введите номер телефона').required('Введите номер телефона'),
        password: Yup.string().min(6, 'Минимум 6 символов').required('Введите пароль'),
    });

    const validationSchemaForVerification = Yup.object().shape({
        code: Yup.string().length(4, 'Код должен состоять из 4 символов').required('Введите код'),
    });

    const onSubmit = async values => {

        if (isRegistration) {
            if(values.password === ''){
                delete values.password
            }
            values[MyRegexp.email().test(values.emailOrPhone) ? 'email' : 'phone'] = values.emailOrPhone;
            delete values.emailOrPhone;
            let newPhone = String(values.phone)
            values.phone = newPhone
            const [data, error] = await createUser(values);
            if (error) {
                return;
            }

            setVerificationId(data.verificationId);
        } else {
            delete values.firstName; delete values.emailOrPhone;
            const [data, error] = await signIn(values);
            if (error) {
                return;
            }

            setVerificationId(data.verificationId);
        }

        const [user, userError] = await getMe();
        if (userError) {
            return;
        }

        if (!isRegistration) {
            const next = new URLSearchParams(location.search).get('next') || '/';
            history.push(next);
        } else {
            setVerification(true);
        }
    };

    const onVerificationSubmit = async values => {
        const [_, error] = await verifyAccount(verificationId, values.code);

        if (error) {
            return;
        }

        const next = new URLSearchParams(location.search).get('next') || '/';
        history.push(next);
    };

    return isRegistration ? (!verification ? (
        (
            <Formik
                initialValues={{
                    firstName: '',
                    emailOrPhone: '',
                    password: ''
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchemaForSignUp}
            >
                {({
                    errors,
                    values,
                    handleChange,
                    handleSubmit,
                    isValid,
                    dirty
                }) => (
                    <form onSubmit={handleSubmit} className='box extange__box_registration'>
                        <h2 className='extange__h2'>Регистрация</h2>
                        <div className='extange__form-registration'>
                            <label className='extange__label' htmlFor='form__name'>Имя
                                <input
                                    type='name'
                                    required
                                    name='firstName'
                                    value={values.firstName}
                                    placeholder='Ваше имя'
                                    onChange={handleChange}
                                    disabled={!isRegistration}
                                    id='form__name' />
                            </label>
                            <label className='extange__label' htmlFor='form__nameform__e-mail'>Телефон
                                <input
                                    type='number'
                                    placeholder='89001234567'
                                    name='emailOrPhone'
                                    value={values.emailOrPhone}
                                    onChange={handleChange}
                                    id='form__e-mail' />
                            </label>
                            <label className='extange__label extange__label_password' htmlFor='form__password'>Пароль (Необязательно)
                                    <input
                                    type={passwordShown ? 'text' : 'password'}
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    placeholder='8 символов'
                                    id='form__password' />
                                <i onClick={() => setPasswordShown(v => !v)} className="extange__icons_eye fas fa-eye"></i>
                            </label>
                        </div>
                        <div className='registration__buttons'>
                            <button disabled={!(isValid && dirty)} type='submit' className='button extange__button_active'>Создать</button>
                            <button onClick={() => setIsRegistration(false)} type='reset' className='button button-ghost'>Уже есть аккаунт?</button>
                        </div>
                    </form>
                )}
            </Formik>
        )
    ) : (
        <Formik
            onSubmit={onVerificationSubmit}
            validationSchema={validationSchemaForVerification}
            initialValues={{
                code: ''
            }}
        >
            {({
                isValid,
                values,
                handleSubmit,
                handleChange,
                dirty
            }) => (
                <div className='box extange__box_confirmation'>
                    <h2 className='extange__h2 extange__h2_confirmation'>Подтвердите аккаунт</h2>
                    <form onSubmit={handleSubmit} className='extange__confirmation'>
                        <label className='extange__label' htmlFor='form__name'>Код из сообщения
                            <input
                                type='text'
                                required
                                name='code'
                                onChange={handleChange}
                                placeholder='Введите 4х значный код'
                                id='form__name' />
                        </label>
                        <button disabled={!(isValid && dirty)} className='button extange__button_active extange__button_confirmation'>Подтвердить</button>
                    </form>
                </div>
            )}
        </Formik>
    )) : (
        <>
        <Formik
            initialValues={{
                login: '',
                password: ''
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchemaForSignIn}
        >
            {({
                errors,
                values,
                handleChange,
                handleSubmit,
                isValid,
                dirty
            }) => (
                <form onSubmit={handleSubmit} className='box extange__box_registration'>
                    <h2 className='extange__h2'>Вход</h2>
                    <div className='extange__form-registration'>
                        <label className='extange__label' htmlFor='form__nameform__e-mail'>Телефон
                            <input
                                type='nuber'
                                placeholder='89001234567'
                                name='login'
                                value={values.login}
                                onChange={handleChange}
                                id='form__e-mail' />
                        </label>
                        <label className='extange__label extange__label_password' htmlFor='form__password'>Пароль
                                <input
                                type={passwordShown ? 'text' : 'password'}
                                required
                                name='password'
                                value={values.password}
                                onChange={handleChange}
                                placeholder='8 символов'
                                id='form__password' />
                            <i onClick={() => setPasswordShown(v => !v)} className="extange__icons_eye fas fa-eye"></i>
                        </label>
                    </div>
                    <div className='registration__buttons'>
                        <button disabled={!(isValid && dirty)} type='submit' className='button extange__button_active'>Войти</button>
                        <button onClick={() => setIsRegistration(true)} type='reset' className='button button-ghost'>Нет аккаунта?</button>
                    </div>
                </form>
            )}
        </Formik>
        </>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        createUser: data => dispatch(actions.user.createUser(data)),
        signIn: data => dispatch(actions.user.signIn(data)),
        getMe: () => dispatch(actions.user.getMe()),
        verifyAccount: (id, code) => dispatch(actions.user.verifyAccount(id, code))
    };
};

const mapStateToProps = state => {
    return {
        ref: state.organization.ref
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Registration));
