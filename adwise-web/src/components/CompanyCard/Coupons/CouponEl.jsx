import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../../store';

function CouponEl({ id, getCoupon, primary = '#0084ff' }) {
  const [coupon, setCoupon] = useState(null);

  const getCouponById = async (id) => {
    const [coupon, error] = await getCoupon(id);

    if (error) {
      return;
    }

    setCoupon(coupon);
  };

  useEffect(() => {
    getCouponById(id);
    return;
  }, []);

  return (
    <React.Fragment>
      <div className='box box__coupon'>
        {coupon ? (
          <div className='company__copone-content'>
            <div
              className='company__back-coupon'
              style={{
                background: `url(${coupon.picture})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {/* <img className='coupon-logo' src={coupon.picture} alt="coupon-picture"/> */}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div className='box__coupon-content'>
                <h4 className='box__h4'>{coupon.name}</h4>
                <p className='box__p_coupon' style={{ color: primary }}>
                  {coupon.description}
                </p>
              </div>
              <div
                className='box__coupon_cashback'
                style={{ backgroundColor: primary }}
              >
                Ваш кэшбэк:&nbsp;<span>{coupon.offer.percent}%</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCoupon: (id) => dispatch(actions.organization.getCoupon(id)),
  };
};

export default connect(null, mapDispatchToProps)(CouponEl);
