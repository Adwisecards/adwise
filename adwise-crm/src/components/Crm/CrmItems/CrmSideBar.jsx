import React from 'react'
import { NavLink } from "react-router-dom";
import logoExample from '../../../main/assets/img/logo-example.svg'

function CrmSideBar() {

    return (

        <div className='cbox__sidebar'>
            <div className='sidebar__company-logo-box'>
                <img src={logoExample} alt="logo-example" />
                <div className='sidebar__company-logo-title'>Название компании</div>
            </div>
            <div className='sidebar-list'>
                <div className='sidebar__title'>Создать</div>
                <div className='sidebar__item'>
                    <div className='sidebar__button'>
                        <p className='sidebar__item-count'>+</p>
                    </div>
                    <div className='sidebar__item-title'>Карточка компании</div>
                </div>
                <div className='sidebar__item'>
                    <div className='sidebar__button'>
                        <p className='sidebar__item-count'>+</p>
                    </div>
                    <div className='sidebar__item-title'>Визитка сотрудника</div>
                </div>
                <div className='sidebar__item'>
                    <div className='sidebar__button'>
                        <p className='sidebar__item-count'>+</p>
                    </div>
                    <div className='sidebar__item-title'>Акция сотрудника</div>
                </div>
                <div className='sidebar__item'>
                    <div className='sidebar__button'>
                        <p className='sidebar__item-count'>+</p>
                    </div>
                    <div className='sidebar__item-title'>Акция для группы сотрудников</div>
                </div>
            </div>
            <div className='sidebar-list'>
                <div className='sidebar__title'>Управление</div>
                <div className='sidebar__item'>
                    <div className='sidebar__item-title'>Сотрудники</div>
                </div>
                <NavLink to="/clients"
                    className='sidebar__item'
                    exact
                    activeClassName="sidebar__item_active"
                >
                    <div className='sidebar__button sidebar__button-number'>
                        <p className='sidebar__item-number'>5</p>
                    </div>
                    <div className='sidebar__item-title'>Клиенты</div>
                </NavLink>
                <div className='sidebar__item'>
                    <div className='sidebar__item-title'>Реферальная программа</div>
                </div>
                <div className='sidebar__item'>
                    <div className='sidebar__item-title'>Кассовый APP</div>
                </div>
                <NavLink to='/operation'
                    className='sidebar__item'
                    activeClassName="sidebar__item_active"
                >
                    <div className='sidebar__item-title'>Операции</div>
                </NavLink>
                <div className='sidebar__item'>
                    <div className='sidebar__item-title'>Финансы</div>
                </div>
            </div>
        </div>

    );
}

export default CrmSideBar;