import React from 'react';

function CompanyExample({ company, annotation }) {
    return (
        <div className='rbox__example'>
            <h3 className='rbox__h3'>Пример отображения на телефоне клиента</h3>
            <div className='rbox__example-img' style={{
                backgroundImage: "url(./img/example-back.png)",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className='rbox__example-header'>
                    <img src={"img/example-1.svg"} alt="example-1" />
                    <img src={"img/example-2.svg"} alt="example-2" />
                </div>
                <img src={"img/example-3.svg"} alt="example-3" />
                <img src={'img/example-4.svg'} alt="example-4" />
            </div>
            <div className='rbox__example-footer' style={{
                backgroundImage: "url(./img/example-footer.png)",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }} >
                <div className='rbox__example-content'>
                    <h5 className='rbox__example-title'>
                        {company}
                    </h5>
                    <p className='rbox__example-desc'>
                        {annotation}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default CompanyExample