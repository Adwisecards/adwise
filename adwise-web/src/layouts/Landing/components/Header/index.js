import React, { Component } from "react";
import { withRouter } from "react-router";
import "./style.css";
import clsx from "clsx";

class Header extends Component {
    constructor(props) {
        super(props);


        this.state = {
            mobileMenu: false,
            langMenu: false,
        };
    }

    render() {
        const {
            mobileMenu,
            langMenu
        } = this.state;
        const activePath = this.props.match.path;

        return (
            <header className={'container-lend header-lend header-landing'}>
                <a href="/" className='logo'>
                    <img src='/img/logoClear.svg' alt='logo' />
                    <div
                        className={
                            !mobileMenu
                                ? 'logo__title'
                                : `${'logo__title'} ${'logo__title_white'}`
                        }
                    >
                        AdWise
                    </div>
                </a>
                <div className='mobile mobile-menu-pagin'>
                    {!mobileMenu ? (
                        <img
                            src='/img/burger.svg'
                            alt='burger'
                            id='burger'
                            onClick={() => this.setState({mobileMenu: true})}
                        />
                    ) : (
                        <img
                            src='/img/close.svg'
                            alt='close'
                            id='close'
                            onClick={() => this.setState({mobileMenu: false})}
                        />
                    )}
                </div>
                <div className="header-menu">
                    <a
                        href="/users-stage"
                        className={clsx({
                            'active': activePath === '/users-stage'
                        })}
                    >Пользователям</a>
                    <a
                        href="/business-stage"
                        className={clsx({
                            'active': activePath === '/business-stage'
                        })}
                    >Бизнесу</a>
                    <a
                        href="/question-answer"
                        className={clsx({
                            'active': activePath === '/question-answer'
                        })}
                    >Вопрос-ответ</a>
                </div>
                <div
                    className={
                        !mobileMenu
                            ? 'auth-pagination auth-pagination__header'
                            : 'auth-pagination auth-pagination__header auth-pagination__header_mobile'
                    }
                >

                    <div className="header-menu header-menu--mobile">
                        <a
                            href="/users-stage"
                            className={clsx({
                                'active': activePath === '/users-stage'
                            })}
                        >Пользователям</a>
                        <a
                            href="/business-stage"
                            className={clsx({
                                'active': activePath === '/business-stage'
                            })}
                        >Бизнесу</a>
                        <a
                            href="/question-answer"
                            className={clsx({
                                'active': activePath === '/question-answer'
                            })}
                        >Вопрос-ответ</a>
                    </div>

                    <a
                        href={`${process.env.REACT_APP_PRODUCTION_CRM_API}/`}
                        className='auth-pagination__item auth-pagination__item_auth'
                    >
                        <div className='auth-pagination__title'>Авторизация</div>
                        <img src='/img/auth.svg' alt='auth' />
                    </a>
                    <a
                        href={`${process.env.REACT_APP_PRODUCTION_CRM_API}/registration-account`}
                        className='
                    auth-pagination__item
                    auth-pagination__item_register
                    mobile-flex
                    '
                    >
                        <div className='auth-pagination__title'>Зарегистрироваться</div>
                        <img src='/img/register.svg' alt='auth' />
                    </a>
                    <div className='language-items'>
                        <div className='language-item-selected'>
                            <div
                                className='
                                auth-pagination__item
                                auth-pagination__item_lang
                                auth-pagination__item_lang-selected
                                '
                                // onClick={()=>{setLangMenu(!langMenu)}}
                            >
                                <div className='auth-pagination__title'>RUS</div>
                                <img src='/img/rusFl.svg' alt='rusFl' />
                            </div>
                        </div>
                        <div
                            className={!langMenu ? 'dn' : 'auth-pagination__item_lang-ul '}
                        >
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>ENG</div>
                                <img src='/img/engFl.svg' alt='engFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>DEU</div>
                                <img src='/img/deuFl.svg' alt='deuFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>SPA</div>
                                <img src='/img/spaFl.svg' alt='spaFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>FRA</div>
                                <img src='/img/fraFl.svg' alt='fraFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>RUS</div>
                                <img src='/img/rusFl.svg' alt='rusFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>IND</div>
                                <img src='/img/indFl.svg' alt='indFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>ITA</div>
                                <img src='/img/itaFl.svg' alt='itaFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>JPN</div>
                                <img src='/img/jpnFl.svg' alt='jpnFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>KOR</div>
                                <img src='/img/korFl.svg' alt='korFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>POR</div>
                                <img src='/img/porFl.svg' alt='porFl' />
                            </div>
                            <div
                                className='
                            auth-pagination__item
                            auth-pagination__item_lang
                            auth-pagination__item_lang-non-select'
                            >
                                <div className='auth-pagination__title'>TUR</div>
                                <img src='/img/turFl.svg' alt='turFl' />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}


export default withRouter(Header)
