import React from 'react';

const Google = (props) => {
  return (
    <svg
      height='35'
      viewBox='0 -0.5 408 467.80000000000007'
      width='35'
      xmlns='http://www.w3.org/2000/svg'
    >
      <linearGradient
        id='a'
        gradientUnits='userSpaceOnUse'
        x2='261.746'
        y1='112.094'
        y2='112.094'
      >
        <stop offset='0' stop-color='#63be6b' />
        <stop offset='.506' stop-color='#5bbc6a' />
        <stop offset='1' stop-color='#4ab96a' />
      </linearGradient>
      <linearGradient
        id='b'
        gradientUnits='userSpaceOnUse'
        x1='.152'
        x2='179.896'
        y1='223.393'
        y2='223.393'
      >
        <stop offset='0' stop-color='#3ec6f2' />
        <stop offset='1' stop-color='#45afe3' />
      </linearGradient>
      <linearGradient
        id='c'
        gradientUnits='userSpaceOnUse'
        x1='179.896'
        x2='407.976'
        y1='229.464'
        y2='229.464'
      >
        <stop offset='0' stop-color='#faa51a' />
        <stop offset='.387' stop-color='#fab716' />
        <stop offset='.741' stop-color='#fac412' />
        <stop offset='1' stop-color='#fac80f' />
      </linearGradient>
      <linearGradient
        id='d'
        gradientUnits='userSpaceOnUse'
        x1='1.744'
        x2='272.296'
        y1='345.521'
        y2='345.521'
      >
        <stop offset='0' stop-color='#ec3b50' />
        <stop offset='1' stop-color='#e7515b' />
      </linearGradient>
      <path
        d='M261.7 142.3L15 1.3C11.9-.5 8-.4 5 1.4c-3.1 1.8-5 5-5 8.6 0 0 .1 13 .2 34.4l179.7 179.7z'
        fill='url(#a)'
      />
      <path d='M.2 44.4C.5 121.6 1.4 309 1.8 402.3L180 224.1z' fill='url(#b)' />
      <path
        d='M402.9 223l-141.2-80.7-81.9 81.8 92.4 92.4L403 240.3c3.1-1.8 5-5.1 5-8.6 0-3.6-2-6.9-5.1-8.7z'
        fill='url(#c)'
      />
      <path
        d='M1.7 402.3c.2 33.3.3 54.6.3 54.6 0 3.6 1.9 6.9 5 8.6 3.1 1.8 6.9 1.8 10 0l255.3-148.9-92.4-92.4z'
        fill='url(#d)'
      />
    </svg>
  );
};
Google.defaultProps = {
  color: '#0084FF',
};
export default Google;
