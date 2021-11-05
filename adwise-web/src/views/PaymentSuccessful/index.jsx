import React, {PureComponent} from 'react'
import queryString from "query-string";
import {openApp} from "../../helper/eventOpenApp";

class PaymentSuccessful extends PureComponent{
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.isSuccess = Boolean(searchParams.Success === "true");
        this.errorMessage = searchParams?.Message || "";
    }

    routeApp = () => {
        openApp()
    }

    render() {
        return (
            <div className="page-not-found">
                <div className="page-not-found__container page-payment__container">
                    <h1 className="page-payment__title">{this.isSuccess ? 'Платёж успешно совершен' : 'Ошибка платежа' }</h1>
                    <div className="page-not-found__content">
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div className='payment-circle' style={{borderColor: (this.isSuccess) ? '#00a44f' : '#DB4368'}}>
                                {this.isSuccess ? (
                                    <i className="fas fa-check" style={{color: '#00a44f'}}></i>
                                ) : (
                                    <i className="fas fa-exclamation" style={{color: '#DB4368'}}></i>
                                )}
                            </div>
                        </div>
                        <div className="page-payment__description">Уважаемый покупатель!</div>
                        <div className="page-payment__title">{(this.isSuccess) ? 'Платёж успешно совершен' : 'Платёж завершен с ошибкой'}</div>
                        <div className="page-payment__description_sub">
                            {(this.isSuccess) ? "По вопросам, связанным с выполнением оплаченного заказа, обращайтесь в тех.поддержку" : this.errorMessage}
                        </div>
                        <div className="page-not-found__bottom">
                            <button onClick={this.routeApp} className="page-not-found__button-home">Вернуться в приложение</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaymentSuccessful
