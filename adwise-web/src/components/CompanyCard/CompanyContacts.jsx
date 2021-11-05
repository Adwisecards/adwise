import React from 'react';
import { SiteIcon } from '../../icons';
import { phoneMask } from '../../helper/phoneMask';

function CompanyContacts(props) {
  const { phone, website, fb, insta, vk, primary = '#0084ff' } = props;

  return (
    <div className='box box__contacts'>
      <a href={phone ? `tel:${phone}` : null} className='box__string-contact'>
        <i
          className='box__icons_phone fas fa-phone-alt'
          style={{ color: primary }}
        ></i>
        <h3 className={phone ? 'box__h3' : 'box__h3 box__null'}>
          {phone ? `${phoneMask(phone)}` : 'Нет телефона'}
        </h3>
      </a>
      <div className='hr'></div>
      <div className='box__string-contact'>
        <SiteIcon color={primary} />
        <h3 className={website ? 'box__h3' : 'box__h3 box__null'}>
          {website ? (
            <a
              target='_blank'
              href={website}
              style={{ color: primary, fontWeight: 600 }}
            >
              Перейти на сайт
            </a>
          ) : (
            'Нет сайта'
          )}
        </h3>
      </div>
      <div className='hr'></div>
      <div className='box__social-networks'>
        {fb ? (
          <a target='_blank' href={fb}>
            <i
              className='box__icons box__icons_contacts fab fa-facebook-f'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        ) : (
          <a>
            <i
              className='box__icons box__icons_contacts fab fa-facebook-f disabled'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        )}
        {insta ? (
          <a target='_blank' href={insta}>
            <i
              className='box__icons box__icons_contacts fab fa-instagram'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        ) : (
          <a>
            <i
              className='box__icons box__icons_contacts fab fa-instagram disabled'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        )}
        {vk ? (
          <a target='_blank' href={vk}>
            <i
              className='box__icons box__icons_contacts fab fa-vk'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        ) : (
          <a>
            <i
              className='box__icons box__icons_contacts fab fa-vk disabled'
              style={{ backgroundColor: primary }}
            ></i>
          </a>
        )}
      </div>
    </div>
  );
}

export default CompanyContacts;
