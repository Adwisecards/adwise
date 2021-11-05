import React from 'react';

function Service({ service, primary = '#0084ff' }) {
  const currency = {
    eur: '€',
    rub: '₽',
    usd: '$',
  };
  function numberWithSpaces(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  }
  return (
    <React.Fragment>
      <div className='box__service'>
        <i
          className='box__icons_service fas fa-circle'
          style={{ color: primary }}
        ></i>
        <div className='box__li-content'>
          <p className='box__service-name box__service-name-sec'>
            {service.name}
          </p>
          <p className='box__service-price'>
            {numberWithSpaces(service.price)}{' '}
            {service.currency ? currency[service.currency] : null}
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Service;
