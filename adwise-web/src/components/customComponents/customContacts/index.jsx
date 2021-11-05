import React from 'react'
import {
    EmailIcon,
    PhoneIcon,
    SiteIcon,
    YouTube,
    Facebook,
    Instagram
} from '../../../icons'
import "./classes.css"

function customContacts ({color, phone, email, site, inst, vk, fb}){
    return(
        <div className='box box__contacts box__contacts_business container-user-contacts'>
            <a href={phone ? `tel:+${phone}` : null} className='contact-item'>
                <PhoneIcon color={color}/>
                <div className={phone ? null : 'text-disabled'}>{phone ? `+${phone}` : 'Нет телефона'}</div>
            </a>
            <div className='contact-item'>
                <EmailIcon color={color}/>
                <div className={email ? null : 'text-disabled' }>{email ? email : 'Нет почты'}</div>
            </div>
            <div className='contact-item mobile-main'>
                <SiteIcon color={color}/>
                <div className={site ? null : 'text-disabled'}>{site ? site : 'Нет сайта'}</div>
            </div>
            <div className='contact-item contact-item-links'>
                <a target="_blank" href={inst} className='contact-item__link'>
                    <div className="link-contact-business" style={{backgroundColor: color}}>
                    <Instagram color='white'/>
                    </div>
                    <div className='mobile-main'>Instagram</div>
                </a>
                <a target="_blank" href={vk} className='contact-item__link'>
                    <div className="link-contact-business" style={{backgroundColor: color}}>
                        <YouTube color='white'/>
                    </div>
                    <div className='mobile-main'>YouTube</div>
                </a>
                <a target="_blank" href={fb} className='contact-item__link'>
                    <div className="link-contact-business" style={{backgroundColor: color}}>
                        <Facebook color='white'/>
                    </div>
                    <div className='mobile-main'>Facebook</div>
                </a>
            </div>
        </div>
    )
}

export default customContacts
