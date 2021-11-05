import React, { Component } from 'react';

import './styles.css';

class NotFound extends Component {
    constructor(props) {
    super(props);

    this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <div className="page-not-found">
                <div className="page-not-found__container">
                    <h1 className="page-not-found__title">Страница не найдена</h1>

                    <div className="page-not-found__content">
                        <div className="page-not-found__description">Данная страница могла быть перемещена или удалена.</div>

                        <div className="page-not-found__container-image">
                            <img src="/img/page-not-found.png" className="page-not-found__image"/>
                        </div>

                        <div className="page-not-found__bottom">
                            <a href="/" className="page-not-found__button-home">Вернуться на главную</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound
