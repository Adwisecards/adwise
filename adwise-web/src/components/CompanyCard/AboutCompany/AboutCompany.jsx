import React from 'react';
import CompanyTags from './CompanyTags';

function AboutCompany({tags, description, primary='#0084ff'}) {
    return (
        <div className='about-company'>
            <h2 className='extange__h2 box__h2_section'>О компании</h2>
            <div className='box box__about-company'>
                <div 
                  className='box__content_about-company'
                  dangerouslySetInnerHTML={{
                    __html: description
                  }}
                />
                <CompanyTags primary={primary} tags={tags}/>
            </div>
        </div>
    )
}

export default AboutCompany