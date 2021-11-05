import React, { Component } from 'react';
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import "./classes.css";

class Refs extends Component {
    constructor(props) {
    super(props);

    this.state = {}
    }

    componentDidMount = async () => {
        await this.getRef();
    }

    getRef = async () => {
        const codeRef = this.props.match.params.ref;

        if (!codeRef) {
            // сообщение об ошибке ( пустой код )
        }

        const ref = await axiosInstance.get(`${ urls["get-ref"] }${ codeRef }`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        });

        if (!ref) {
            // сообщение об ошибке
        }

        switch (ref.mode) {
            case "purchase": {
                this.props.history.replace(`/purchase/${ ref.ref }`);

                break
            }
            case "contact": {
                this.props.history.replace(`/card/${ ref.ref }`);

                break
            }
        }
    }

    render() {
        return (
            <div className="container body">
                <div className="loading-popup">

                    <svg className="loading-popup__loader" width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="55" cy="55" r="53" stroke="url(#paint_loading_linear)" strokeWidth="4"/>
                        <defs>
                            <linearGradient id="paint_loading_linear" x1="99.5" y1="110.005" x2="-4.19089e-06" y2="110.003" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#8152E4"/>
                                <stop offset="1" stopColor="#ED8E00"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="loading-popup__message">Идет загрузка...</div>

                </div>
            </div>
        );
    }
}

export default Refs
