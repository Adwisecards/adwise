import React from 'react';
import { SubscribeButton } from './components';

export default function SubscribeBox(props) {
  const {
    qrcode,
    orgRef,
    name,
    briefDescription,
    button,
    subscribed,
    primary,
    handleCheckInstallApp,
  } = props;

  const subscribeStyle =
    qrcode || orgRef ? null : { borderRadius: '10px', width: 450 };

  return (
    <div className='box__content_subscribe' style={subscribeStyle}>
      <h1 className='box__h1'>{name}</h1>
      <p className='box__p'>{briefDescription}</p>
      <SubscribeButton button={button} subscribed={subscribed} primary={primary} handleCheckInstallApp={handleCheckInstallApp}/>
    </div>
  );
}
