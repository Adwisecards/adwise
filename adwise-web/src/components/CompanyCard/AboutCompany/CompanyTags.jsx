import React from 'react';

function CompanyTags({tags, primary='#0084ff'}) {
    return (
        <div className='box__tags'>
            {tags.map(t => {
                return <div key={t._id} className='box__tag' style={{backgroundColor:primary}}>{t.name}</div>
            })}
        </div>
    )
}

export default CompanyTags
