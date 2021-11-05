import React from 'react';
import CouponEl from './CouponEl';
import Carousel, { consts } from 'react-elastic-carousel';
import { useEffect } from 'react';
import { useState } from 'react';

function Coupons({ coupons, primary = '#0084ff' }) {
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 320, itemsToShow: 1, enableMouseSwipe: true },
    { width: 476, itemsToShow: 3, enableMouseSwipe: false },
    { width: 1200, itemsToShow: 3 },
  ];
  return (
    <div
      className='coupons'
      style={coupons.length ? { display: 'block' } : { display: 'none' }}
    >
      <h2 className='extange__h2 box__h2_section'>Купоны</h2>
      <div
        className={
          coupons.length === 2
            ? 'coupon-container coupon-container-width'
            : 'coupon-container'
        }
      >
        <Carousel
          itemPosition={consts.START}
          itemPadding={[0, 0]}
          itemsToShow={3}
          enableMouseSwipe={false}
          pagination={false}
          breakPoints={breakPoints}
        >
          {coupons.map((c) => {
            return <CouponEl primary={primary} width='300px' key={c} id={c} />;
          })}
        </Carousel>
        <div className='slider__arrow_right'>
          <img src={'/img/arrow-right.svg'} alt='arrow-right' />
        </div>
      </div>
    </div>
  );
}

export default Coupons;
