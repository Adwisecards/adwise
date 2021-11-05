import React from 'react';

export default function QrcodeViews(props) {
  const { qrcodeViews, orgRef, qrcode } = props;
  const qrView = orgRef ? orgRef.QRCode : qrcode;
  if (!!qrcodeViews) {
    return <img src={qrView} alt='qr' className='box__qr' />;
  } else return <div src={null} className='box__qr box__qr_null' />;
}
