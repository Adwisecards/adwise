import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Map from '../../Map/Map';

const mapDay = ({}) => {
  const map = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  return map[new Date().getDay()];
};

const Contacts = ({
  email,
  address,
  coords,
  schedule,
  branchOffices,
  primary = '#0084ff',
}) => {
  const daySchedule = schedule ? schedule[mapDay()] : null;
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [accordion, setAccordion] = useState(false);
  const places = [
    //Координаты маркера и центра при неоходимости, можно добавлять маркеры
    {
      name: 'Company',
      title: 'Company',
      lat: lat,
      lng: lng,
      id: 1,
    },
  ];
  function changeAccordion() {
    setAccordion(!accordion);
  }
  useEffect(() => {
    if (!coords) {
      return 0;
    }
    setLat(coords[0]);
    setLng(coords[1]);
    return;
  });
  const branch = [
    {
      country: 'russia',
      region: 'Sverdlovsk',
      city: 'Ekat',
      addres: 'str.Shevchenko, h.9',
      details: 'first padik',
    },
    {
      country: 'russia',
      region: 'Moskou oblast',
      city: 'Moskou',
      addres: 'str.Lenina, h.8',
      details: 'first padik',
    },
  ];
  return (
    <div className='contacts'>
      <h2 className='extange__h2 box__h2_section'>Контакты</h2>
      <div className='box box__contacts-block'>
        {coords ? (
          <Map
            googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyAE3aQq2N0eY_LrWgXA9gE6NjnMmaNsHrk'
            //Если убрать стили, то ничего работать не будет. Стили можно менять
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `152px` }} />}
            mapElement={
              <div
                style={{
                  height: `100%`,
                  borderRadius: `5px 5px 0 0`,
                  outline: 'none',
                  cursor: 'none',
                }}
              />
            }
            //Координаты центра
            center={{ lat: lat, lng: lng }}
            //Коофициент увеличения
            zoom={15}
            places={places}
          />
        ) : null}

        <div className='box__contacts__ul'>
          <div className='box__contact-li'>
            <i
              className='box__icons_contact fas fa-map-marker-alt'
              style={{ color: primary }}
            ></i>
            <div>
              <p className='box__service-name'>{address}</p>
              <div className='hr'></div>
              {branchOffices.length ? (
                <div className='box__li-content'>
                  <p className='box__contacts_branch'>
                    <div
                      onClick={() => changeAccordion()}
                      className='branch-company-count'
                    >
                      Филиалов компании: {branchOffices.length}
                      <i
                        className={
                          accordion
                            ? 'fas fa-chevron-down'
                            : 'fas fa-chevron-down fa-chevron-down-transform'
                        }
                        style={{ color: primary }}
                      ></i>
                    </div>
                    <div className={accordion ? 'accordion' : 'accordionNone'}>
                      {branchOffices.map((b, idx) => {
                        return (
                          <div className='accordion-item' key={idx}>
                            <div>
                              {b.addres}, {b.city}, {b.region}, {b.country}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </p>
                </div>
              ) : (
                <div className='box__li-content'>
                  <p
                    className='box__contacts_branch branch-company-no-count'
                    style={{ color: primary }}
                  >
                    У компании нет филиалов
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className='box__contact-li'>
            <i
              className='box__icons_contact far fa-clock'
              style={{ color: primary }}
            ></i>
            <div className='box__li-content'>
              <p
                className={
                  daySchedule
                    ? 'box__service-name'
                    : 'box__service-name box__null'
                }
              >
                {daySchedule
                  ? `Сегодня с ${daySchedule.from} до ${daySchedule.to}`
                  : 'Компания не добавила часы работы'}
              </p>
              {/* <i className="fas fa-chevron-down"></i> */}
            </div>
          </div>
          <div className='hr'></div>
          <div className='box__contact-li'>
            <i
              className='box__icons_contact far fa-envelope'
              style={{ color: primary }}
            ></i>
            <div className='box__li-content'>
              <p
                className={
                  email ? 'box__service-name' : 'box__service-name box__null'
                }
              >
                {email ? email : 'Компания не добавила почту'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
