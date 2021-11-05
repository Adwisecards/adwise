import React from 'react';

export default function SubscribeButton(props) {
  const { subscribed, button, handleCheckInstallApp, primary } = props;
  const isSubscribed = !subscribed ? 'Подписаться' : 'Вы подписаны';

  if (!!button) {
    return (
      <button
        disabled={subscribed}
        onClick={handleCheckInstallApp}
        className='button button__subscribe'
        style={{ backgroundColor: primary }}
      >
        {isSubscribed}
      </button>
    );
  } else return null;
}
