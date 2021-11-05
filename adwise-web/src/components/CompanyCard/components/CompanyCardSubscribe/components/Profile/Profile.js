import React from 'react';
import clsx from 'clsx';

export default function Profile(props) {
  const { background, primary, logo } = props;

  const logoBoxClass = clsx({ ['background-logo']: logo });
  const logoClass = clsx({ ['company__back-logo-img']: logo }, 'back-logo-img');
  const isSetLogo = logo ? logo : '/img/logoZagl.svg';
  const backgoundStyle = !!background
    ? {
        background: `url(${background}) no-repeat`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }
    : {
        background: `url(/img/background-mini.png) no-repeat`,
        backgroundColor: primary,
      };

  return (
    <div style={backgoundStyle} className='company__back-logo'>
      <div className={logoBoxClass}>
        <img className={logoClass} src={isSetLogo} alt='company-log' />
      </div>
    </div>
  );
}
