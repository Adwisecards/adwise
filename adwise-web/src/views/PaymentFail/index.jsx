import React from 'react'
import {openApp} from "../../helper/eventOpenApp";

function PaymentFail(){

    const handleGoApp = () => {
        openApp()
    }

    return(
            <div className="page-not-found page-payment ">
                <div className="page-not-found__container page-payment__container">
                    <h1 className="page-payment__title">Платёж не прошёл</h1>
                    <div className="page-not-found__content">
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div className='payment-circle' style={{borderColor:'#eb8481'}}>
                                <i class="fas fa-times" style={{color:'#eb8481'}}></i>
                            </div>
                        </div>
                        <div className="page-payment__description">Уважаемый покупатель!</div>
                        <div className="page-payment__title">Платёж не прошёл</div>
                        <div className="page-payment__description_sub">По вопросам, связанным с выполнением оплаченного заказа, обращайтесь в тех.поддержку</div>
                        <div className="page-not-found__bottom">
                            <button onClick={handleGoApp} className="page-not-found__button-home">Вернуться на главную</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default PaymentFail