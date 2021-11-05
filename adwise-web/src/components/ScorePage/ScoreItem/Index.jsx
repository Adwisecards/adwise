import React from 'react'
import { Copy } from '../../../icons'

const ScoreItem = ({number, date, status, codeUser, qrcode, copyCode, products}) =>{
    return(
        <div className='box box-score'>
            <div className='score-header'>
                <div className='score-number'>
                    Счёт № {number}
                </div>
                <div className='box__p score-p'>
                    {date}
                </div>
                <div className='score-status'>
                    {status}
                </div>
            </div>
            <div className='score-body'>
                <div className='score-user-code'>
                    Код пользователя<span>{codeUser}</span>
                </div>
                <div className='score-main'>
                    <div className='score-table-box desktop'>
                        <table className='score-table'>
                            <thead className='score-thead'>
                                <tr className='score-table-tr'>
                                    <td className='score-product-title'>Товар</td>
                                    <td className='score-product-quantity'>Кол-во</td>
                                    <td className='score-product-price'>Цена</td>
                                    <td className='score-product-sum'>Сумма</td>
                                </tr>
                            </thead>
                            <tbody className='score-tbody'>
                                {products.map((p, idx)=>{
                                       return (<tr className='score-tbody-tr' key={idx}><td className='score-product-title'>{p.title}</td>
                                            <td className='score-product-quantity'>{p.quantity}</td>
                                            <td className='score-product-price'>{p.price}</td>
                                            <td className='score-product-sum'>{p.sum}</td></tr>)
                                    })
                                }
                            </tbody>
                            <tfoot className='score-tfoot'>
                                <tr>
                                    <td className='score-product-totalSum' colSpan='4'>Итого:</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className='score-contact'>
                        <div className='score-qr-box'>
                            <div className='score-qr-title'>Qr код счёта</div>
                            <div className='score-qr-body'>
                                <img src={qrcode} alt="qrcode"/>
                            </div>
                        </div>
                        <div className='score-contact-code-copy'>{copyCode}<Copy/></div>
                    </div>
                </div>
                <button className='button button__subscribe score-button'>Оплатить</button>
            </div>
        </div>
    )
}

export default ScoreItem