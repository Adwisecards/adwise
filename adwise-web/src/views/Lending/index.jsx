import React, { Component, useState } from 'react';
import styles from './style/style.css';
import { Link } from 'react-router-dom';
import Plx from 'react-plx';
import { useEffect } from 'react';
import Apple from '../../icons/common/Apple';
import Google from '../../icons/common/Google';
import { agent } from '../../axios';
import StyledContentLoader from 'styled-content-loader';
import {NumericalReliability} from "../../helper/numericalReliability";

const imageVideo = require('./style/img/video-background.jpeg');

function Lending(props) {
  const cb = (e) => listener(e);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const [packetsIsLoading, setPacketsIsLoading] = useState(true);
  const [packets, setPackets] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isShowVideo, setShowVideo] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [noScroll, setNoScroll] = useState(0);
  const [activeSlider, setActiveSlider] = useState(1);
  const backgroundColor = '#d6befd';
  const foregroundColor = 'rgb(232,222,232)';
  const currency = {
    rub: '₽',
    usd: '$',
  };
  const language = {
    rus: {
      title: 'rus',
      flag: '/img/rusFl.svg',
    },
  };
  let scroll = false;
  function createObserver(element) {
    let observer;

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(element);
  }

  const onsubmit = async () => {
    let body = {
      name: name,
      email: email,
    };

    try {
      let res = await agent.post('/global/email/request-call', body);
      return setSubmit(true);
    } catch (ex) {
    }
  };

  const onPackets = async () => {
    try {
      let res = await agent.get('/organizations/get-packets', {
        headers: {
          authentication:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmMxNTgyMjk2ODU1YTAwMjg1ZmFkMWUiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjEwNDQ4MDk2LCJleHAiOjE2MTgyMjQwOTZ9.tvYJ5a5vwIbF9trKnXft-62JdTdQLD30YmnH0vuienI',
        },
      });
      return setPackets(res.data.data.packets), setPacketsIsLoading(false);
    } catch (ex) {
    }
  };

  function handleIntersect() {
    const body = document.body;
    const html = document.html;
    if (scroll) {
      const boxPropmo = document.getElementById('promo-third');
      body.classList.add('stop-scrolling');
      body.classList.add('promo__third-scroll');
      window.addEventListener('wheel', cb, false);
    }

    scroll = true;
  }
  function listener(e) {
    let select = document.querySelectorAll('.promo-select-item');
    let imgs = document.querySelectorAll('.promo-card-img-absolute-in');
    if (e.deltaY > 0) {
      for (let i = 0; i < select.length; i++) {
        if (i !== select.length - 1) {
          if (select[i].classList.contains('promo-select-item-active')) {
            select[i].classList.remove('promo-select-item-active');
            select[i + 1].classList.add('promo-select-item-active');
            for (let j = 0; j < imgs.length; j++) {
              if (j !== imgs.length - 1) {
                if (
                  imgs[j].classList.contains(
                    'promo-card-img-absolute-in-active'
                  )
                ) {
                  imgs[j].classList.remove('promo-card-img-absolute-in-active');
                  imgs[j + 1].classList.add(
                    'promo-card-img-absolute-in-active'
                  );
                  break;
                }
              }
            }
            break;
          }
        } else {
          document.body.classList.remove('stop-scrolling');
          window.removeEventListener('wheel', cb, false);
          break;
        }
      }
    }
    if (e.deltaY < 0) {
      for (let i = select.length - 1; i < select.length; i--) {
        if (i !== 0) {
          if (select[i].classList.contains('promo-select-item-active')) {
            select[i].classList.remove('promo-select-item-active');
            select[i - 1].classList.add('promo-select-item-active');
            for (let j = imgs.length - 1; j < imgs.length; j--) {
              if (j !== 0) {
                if (
                  imgs[j].classList.contains(
                    'promo-card-img-absolute-in-active'
                  )
                ) {
                  imgs[j].classList.remove('promo-card-img-absolute-in-active');
                  imgs[j - 1].classList.add(
                    'promo-card-img-absolute-in-active'
                  );
                  break;
                }
              }
            }
            break;
          }
        } else {
          document.body.classList.remove('stop-scrolling');
          window.removeEventListener('wheel', cb, false);
          break;
        }
      }
    }
  }

  useEffect(() => {
    const elems = document.querySelectorAll('.promo-select-item');
    const imgs = document.querySelectorAll('.promo-card-img-absolute-in');
    elems.forEach((el) => {
      el.addEventListener('mouseover', (e) => {
        elems.forEach((elem) => {
          if (elem.classList.contains('promo-select-item-active')) {
            elem.classList.remove('promo-select-item-active');
          }
          el.classList.add('promo-select-item-active');
          for (let i = 0; i < elems.length; i++) {
            if (elems[i].classList.contains('promo-select-item-active')) {
              imgs.forEach((img) => {
                if (
                  img.classList.contains('promo-card-img-absolute-in-active')
                ) {
                  img.classList.remove('promo-card-img-absolute-in-active');
                  imgs[i].classList.add('promo-card-img-absolute-in-active');
                }
              });
            }
          }
        });
      });
    });
    // const boxElement = document.querySelector('#promo-third');
    // createObserver(boxElement);
    window.onload = function () {
      let right = document.getElementById('promo-card__header-right');
      let left = document.getElementById('promo-card__header-left');
    };
    onPackets();
  }, []);
  const exampleParallaxData = [
    {
      start: 0,
      end: 150,
      properties: [
        {
          startValue: 0,
          endValue: 45,
          property: 'translateY',
        },
        {
          startValue: 1,
          endValue: 0.75,
          property: 'opacity',
        },
      ],
    },
  ];
  const borderGgradientLeft = [
    {
      start: 0,
      end: 600,
      properties: [
        {
          startValue: 100,
          endValue: 0,
          property: 'translateX',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  const borderGgradientBottom = [
    {
      start: 0,
      end: 800,
      properties: [
        {
          startValue: -100,
          endValue: 0,
          property: 'translateX',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  const borderGgradientLeftTop = [
    {
      start: 0,
      end: 900,
      properties: [
        {
          startValue: 100,
          endValue: 0,
          property: 'translateX',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  const ticketLeft = [
    {
      start: 0,
      end: 3150,
      properties: [
        {
          startValue: -600,
          endValue: 0,
          property: 'translateX',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  const ticketRight = [
    {
      start: 0,
      end: 3150,
      properties: [
        {
          startValue: 600,
          endValue: 0,
          property: 'translateX',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  const propmoSixth = [
    {
      start: 0,
      end: 3500,
      properties: [
        {
          startValue: 600,
          endValue: 0,
          property: 'translateY',
        },
        {
          startValue: 0,
          endValue: 1,
          property: 'opacity',
        },
      ],
    },
  ];
  return (
    <div className='main-box'>
      {
        false && (
            <header className={'container-lend header-lend'}>
              <div className='logo'>
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
              </div>
              <div className='mobile mobile-menu-pagin'>
                {!mobileMenu ? (
                    <img
                        src='/img/burger.svg'
                        alt='burger'
                        id='burger'
                        onClick={() => {
                          setMobileMenu(true);
                        }}
                    />
                ) : (
                    <img
                        src='/img/close.svg'
                        alt='close'
                        id='close'
                        onClick={() => {
                          setMobileMenu(false);
                        }}
                    />
                )}
              </div>
              <div
                  className={
                    !mobileMenu
                        ? 'auth-pagination auth-pagination__header'
                        : 'auth-pagination auth-pagination__header auth-pagination__header_mobile'
                  }
              >
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

      <div className='promo promo__first container-lend'>
        <div
          id='promo-card__header-left'
          className='promo-card promo-card__header-left '
        >
          <div className='promo-card-title'>CRM система мудрых продаж</div>
          <div className='promo-card-text'>
            Знаем как привести к вам покупающего клиента
          </div>
          <a
            href={`${process.env.REACT_APP_PRODUCTION_CRM_API}/registration-account`}
            className='promo-card-button'
          >
            Зарегистрироваться
          </a>
        </div>
        <div
          id='promo-card__header-right'
          className='promo-card promo-card__header-right'
        >
          <div className='promo-card-title'>Приложение на Android и iOS</div>
          <div className='promo-card-text'>
            Для клиентов, вас и ваших сотрудников
          </div>
          <div className='promo-card-button-icon-box'>
            <a
              target='_blank'
              href='https://apps.apple.com/ru/app/adwise-cards/id1537570348'
              className='promo-card-button promo-card-button-icon'
            >
              <Apple />
            </a>
            <a
              target='_blank'
              href='https://play.google.com/store/apps/details?id=ad.wise.win'
              className='promo-card-button promo-card-button-icon'
            >
              <Google />
            </a>
          </div>
        </div>
      </div>

      {/* section video */}
      <div className="container-lend">
        <div className='section-video'>
          {
            isShowVideo ? (
                <>
                <iframe
                    type="text/html"
                    width="100%"
                    height="100%"
                    // src={`https://www.youtube.com/embed/${process.env.REACT_APP_PRESENTATION_VIDEO}?autoplay=1&enablejsapi=1`}
                    src={`https://www.youtube.com/embed/-RtL5DsfvZk?autoplay=1&enablejsapi=1`}
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in- picture"
                />
                </>
            ) : (
                <>
                  <div className="section-video__container" style={{cursor: 'pointer'}} onClick={() => setShowVideo(true)}>

                    <div className="section-video__title">Презентационное<br/>видео</div>

                    <div className="section-video__play">
                      <svg width="35" height="41" viewBox="0 0 35 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M34 18.768C35.3333 19.5378 35.3333 21.4623 34 22.2321L3.25 39.9856C1.91667 40.7554 0.250002 39.7931 0.250002 38.2535L0.250004 2.74648C0.250004 1.20688 1.91667 0.244626 3.25 1.01443L34 18.768Z" fill="#ED8E00"/>
                      </svg>
                    </div>
                  </div>
                  <img src={imageVideo}/>
                </>
            )
          }
        </div>
      </div>
      {/* end section video */}

      <div className='promo promo__second container-lend'>
        <div className='promo-flex-box promo-header-box'>
          <div className='promo-card promo-card__header-left'>
            <div className='promo-card-title'>
              3 элемента для генерации клиентов
            </div>
          </div>
          <Plx
            parallaxData={borderGgradientLeft}
            className='promo-text promo-text__border-gradient_left'
          >
            Личные рекомендации эффективный метод создающий лояльных и
            постоянных клиентов
          </Plx>
        </div>
        <div className='promo-flex-box'>
          <Plx
            parallaxData={borderGgradientBottom}
            className='promo-text promo-text__border-bottom '
          >
            Реферальная программа создающая учёт, контроль и гарантию выплаты
            для того, кто рекомендует ваш товар или услугу
          </Plx>
          <Plx
            parallaxData={borderGgradientLeftTop}
            className='promo-text promo-text__border-gradient_left-top'
          >
            Электронные визитки превращающие ваших сотрудников в менеджеров по
            продажам
          </Plx>
        </div>
      </div>
      <div id='promo-third' className='promo container-lend promo__third '>
        <div className='promo-card promo-card__header-left'>
          <div className='promo-card-title'>Как это работает?</div>
          <div className='promo-select'>
            <div className='promo-select-item-active promo-select-item'>
              <img src={'img/border.svg'} />
              <div>Вы создаёте своим сотрудникам электронные визитки</div>
            </div>
            <div className='promo-select-item'>
              <img src={'img/border.svg'} />
              <div>
                Оформляете для них уникальные предложения, которые будут
                привлекать клиентов
              </div>
            </div>
            <div className='promo-select-item'>
              <img src={'img/border.svg'} />
              <div>
                Сотрудники раздают свои электронные визитки вместе с купонами,
                таким образом они расширяют клиентскую сеть для вашего бизнеса
              </div>
            </div>
            <div className='promo-select-item'>
              <img src={'img/border.svg'} />
              <div>
                Клиенты получают кэшбэк, сотрудники — вознаграждение, а ваш
                бизнес получает дополнительный источник клиентов и продаж!
              </div>
            </div>
            <div className='promo-select-item '>
              <img src={'img/border.svg'} />
              <div>
                Таким образом, даже ваш водитель, дизайнер, секретарь становятся
                теми людьми, которые создают клиентский поток
              </div>
            </div>
          </div>
        </div>
        <img
          src='/img/back-3.png'
          className='promo-card-img-absolute desktop'
          alt='back'
        />
        <img
          src='/img/back-3.1.png'
          className='promo-card-img-absolute-in promo-card-img-absolute-in-active desktop'
          alt='back'
        />
        <img
          src='/img/back-3.2.png'
          className='promo-card-img-absolute-in desktop'
          alt='back'
        />
        <img
          src='/img/back-3.3.png'
          className='promo-card-img-absolute-in desktop'
          alt='back'
        />
        <img
          src='/img/back-3.4.png'
          className='promo-card-img-absolute-in desktop'
          alt='back'
        />
        <img
          src='/img/back-3.5.png'
          className='promo-card-img-absolute-in desktop'
          alt='back'
        />
      </div>
      <div className='promo promo__fourth container-lend '>
        <div className='promo-card promo-card__header-left'>
          <div className='logo'>
            <img src='/img/logoClear.svg' alt='logo' />
            <div className='logo__title'>AdWise</div>
          </div>
          <div className='promo-card-title'>Сервис мудрых продаж</div>
        </div>
      </div>

      {packets
        ? packets.length > 0 && (
            <div className='promo promo__fifth container-lend'>
              <div className='promo-card promo-card__header-left'>
                <div className='promo-card-title'>Стоимость лицензии</div>
                <div className='promo-card-text'>
                  Откройте дополнительные возможности AdWise. Узнайте больше о
                  пакетах привилегий
                </div>
              </div>
              <div className='promo-card-body ticket-box'>
                {
                  packets.map((paket, idx) => (
                      <Plx parallaxData={Boolean(idx % 2 === 0) ? ticketLeft : ticketRight} className='ticket'>
                        <div className='ticket-header'>
                          <div className='ticket-title-box'>
                            <div className='ticket-sub-title'>Тариф</div>
                            <StyledContentLoader
                                backgroundColor={backgroundColor}
                                foregroundColor={foregroundColor}
                                isLoading={packetsIsLoading}
                            >
                              <div className='ticket-title'>
                                {paket?.name}
                              </div>
                            </StyledContentLoader>
                          </div>
                          <StyledContentLoader
                              backgroundColor={backgroundColor}
                              foregroundColor={foregroundColor}
                              isLoading={packetsIsLoading}
                          >
                            <div className='ticket-logo'>
                              <img src='/img/ticketLogo1.svg' alt='ticketLogo' />
                            </div>
                          </StyledContentLoader>
                        </div>
                        <div className='ticket-body'>
                          <StyledContentLoader
                              backgroundColor={backgroundColor}
                              foregroundColor={foregroundColor}
                              isLoading={packetsIsLoading}
                          >
                            <div className='ticket-offer'>
                              {`${paket.price} / ${paket.period} ${NumericalReliability(paket.period, ['месяц', 'месяца', 'месяцев'])}`}
                            </div>
                            <div className='ticket-conditions'>
                              {paket.limit === 1
                                  ? `1 сотрудник, 1 акция`
                                  : `Без ограничений`}
                            </div>
                          </StyledContentLoader>
                        </div>
                      </Plx>
                  ))
                }
              </div>
            </div>
          )
        : null}
      {!submit ? (
        <Plx
          parallaxData={propmoSixth}
          className='promo promo__sixth container-lend '
        >
          <div className='promo-card promo-card__header-left'>
            <div className='promo-card-title'>Узнать подробнее о проекте</div>
            <div className='promo-card-text'>
              Оставь свои данные, и мы обязательно с вами свяжемся!
            </div>
          </div>

          <div className='promo-card-body'>
            <form className='form'>
              <div className='inputs-box'>
                <div className='input-box'>
                  <label>Ваше имя</label>
                  <input
                    placeholder='Иван'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='input-box'>
                  <label>E-mail</label>
                  <input
                    placeholder='mail@mail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div
                onClick={submit ? null : () => onsubmit()}
                className='promo-card-button'
              >
                Отправить
              </div>
            </form>
          </div>
        </Plx>
      ) : (
        <Plx
          parallaxData={propmoSixth}
          className='promo promo__sixth container-lend '
        >
          <div className='promo-card promo-card__header-left'>
            <div className='promo-card-title'>Спасибо!</div>
            <div className='promo-card-text'>
              Мы свяжемся с Вами в ближайшее время.
            </div>
          </div>
        </Plx>
      )}
      <footer className='container-lend footer-lend '>
        <div className='header-lend'>
          <div className='logo'>
            <img src='/img/logoClear.svg' alt='logo' />
            <div className='logo__title'>AdWise</div>
            <div className='logo__title logo__title_email'>
              support@adwise.cards
            </div>
          </div>
          <div className='auth-pagination auth-pagination__footer'>
            <a
              href={`${process.env.REACT_APP_PRODUCTION_CRM_API}/`}
              className='auth-pagination__item auth-pagination__item_auth'
            >
              <div className='auth-pagination__title'>Авторизация</div>
              <img src='/img/auth.svg' alt='auth' />
            </a>
            <a
              href={`${process.env.REACT_APP_PRODUCTION_CRM_API}/registration-account`}
              className='auth-pagination__item auth-pagination__item_register'
            >
              <div className='auth-pagination__title'>Зарегистрироваться</div>
              <img src='/img/register.svg' alt='auth' />
            </a>
          </div>
        </div>
        <div className='bottom-line'>
          <div className='footer-text'>
            Сopyright © 2020. All rights reserved
          </div>
          <Link to='/user-agreement' className='footer-link'>
            Пользовательское соглашение
          </Link>
          <Link to='/privacy-policy' className='footer-link'>
            Политика конфиденциальности
          </Link>
          <Link to='/advertising-agreement' className='footer-link'>
            Договор возмездного оказания услуг
          </Link>
          <Link to='/delivery-terms' className='footer-link'>
            Условия доставки и возварата
          </Link>
        </div>
        <div className='bottom-line bottom-line-tinkov'>
          <div className='footer-text '>
            ООО «ЭДВАЙЗ», ИНН: 6685180761, ОГРН: 1206600065539
          </div>
          <img src='/img/tinkov.svg' alt='tinkov' />

        </div>
      </footer>
    </div>
  );
}

export default Lending;
