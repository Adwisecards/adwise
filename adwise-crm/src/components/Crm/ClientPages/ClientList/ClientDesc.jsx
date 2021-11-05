import React from 'react'
import ClientHistory from './ClientHistory'
import { NavLink } from "react-router-dom";
import arrowLeft from '../../../../main/assets/img/arrowleft.svg'
import avatar from '../../../../main/assets/img/avatar.png'
import messgeIcon from '../../../../main/assets/img/messge-icon.svg'
import giftIcon from '../../../../main/assets/img/gift-icon.svg'
import filter from '../../../../main/assets/img/filter.svg'

function ClientDesc({ openDesc }) {

    return (
        <div className='cbox cbox-content cbox-content_clients'>
            <div className='cbox-content__main'>
                <div className='cbox__header_content'>
                    <div className='cbox__title_content'>
                        <NavLink to='/clients'>
                            <img src={arrowLeft}
                                alt="arrow-left"
                                onClick={openDesc}
                                className='cbox__arrow_left'
                            />
                        </NavLink>
                        <div className='cbox__h2'>Клиент</div>
                    </div>

                </div>
                <div className='cbox__desc-user-info'>
                    <div className='cbox__desc-user-title'>
                        <img
                            src={avatar}
                            alt="avatar"
                            className='cbox__table-item_img'
                        />
                        <div className='cbox__table-item_name'>
                            Александр
                            Макаров
                        </div>
                    </div>
                    <div className='cbox__desc-user-title-icon'>
                        <img src={messgeIcon} alt="messge-icon" className='ico' />
                        <img src={giftIcon} alt="gift-icon" className='ico' />
                    </div>
                </div>
                <div className='cbox__filter'>
                    <div
                        className='cbox__button cbox__button_sm'
                    >
                        <img src={filter} alt="filter" />
                    </div>
                    <div></div>
                </div>

                <div className='cbox__main'>
                    <div className='cbox__table'>
                        <div className='cbox__thead'>
                            <div className='cbox__thead-item cbox__thead-item_toClient'>
                                Клиент
                            </div>
                            <div className='cbox__thead-item cbox__thead-item_date'>
                                Дата
                            </div>
                            <div className='cbox__thead-item cbox__thead-item_type'>
                                Тип
                            </div>
                            <div className='cbox__thead-item cbox__thead-item_cashier'>
                                Кассир
                            </div>
                            <div className='cbox__thead-item cbox__thead-item_payment'>
                                Оплата, ₽
                            </div>
                            <div className='cbox__thead-item cbox__thead-item_'>
                                Оплата, баллы
                            </div>
                        </div>
                        <div className="cbox__tbody cbox__tbody_small">
                            <ClientHistory />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDesc;