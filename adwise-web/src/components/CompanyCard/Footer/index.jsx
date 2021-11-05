import React from 'react';

const Footer = ({ primary = '#0084ff' }) => {
  return (
    <React.Fragment>
      <div className='hr hr_blue' style={{ backgroundColor: primary }}></div>
      <div className='footer__company-card'>
        <div className='box__footer_logo'>
          <img src={'/img/logo.svg'} alt='logo' />
          <p>
            Нравится это? Рекомендуй это!<br/>
            Получай бонусы с покупок с AdWise!<br/>
            Установи приложение прямо сейчас!<br/>
          </p>
        </div>
        <div className='box__app-links'>
          <a
            target='_blank'
            href='https://apps.apple.com/ru/app/adwise-cards/id1537570348'
          >
            <img src={'/img/appstore.svg'} alt='appstore' />
          </a>
          <a
            target='_blank'
            href='https://play.google.com/store/apps/details?id=ad.wise.win'
          >
            <img src={'/img/googleplay.svg'} alt='googleplay' />
          </a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
