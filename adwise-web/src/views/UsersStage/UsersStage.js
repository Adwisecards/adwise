import React, {Component} from 'react';
import {
    Stage as StageComponent
} from "./components";
import "./styles.css"

class UsersStage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stages: [
                {
                    title: "Скачай<br/>и зарегистрируйся<br/>в приложении",
                    image: "/img/users-stage/stage-1.png"
                },
                {
                    title: "Совершай<br/>покупки<br/>и копи кэшбэк",
                    image: "/img/users-stage/stage-2.png"
                },
                {
                    title: "Рекомендуй<br/>любимые<br/>заведения<br/>друзьям",
                    image: "/img/users-stage/stage-3.png"
                },
                {
                    title: "Получай<br/>кэшбэк<br/>от покупок<br/>друзей!",
                    image: "/img/users-stage/stage-4.png"
                },
            ]
        }
    }

    componentDidMount = () => {
    }

    render() {
        const { stages } = this.state;

        return (
            <section className="container">

                <h1 className="title">4 простых шага для достижения<br/>успеха с <span>AdWise App</span></h1>

                <div className="stages">

                    {
                        stages.map((stage, idx) => (
                            <StageComponent
                                number={idx + 1}
                                {...stage}
                            />
                        ))
                    }

                </div>

                <div className="section-app">
                    <h1>Скачать приложение</h1>

                    <div className="section-app__items">

                        <a href="https://play.google.com/store/apps/details?id=ad.wise.win" target="_blank" className="section-app__item">
                            <img src="/img/app/google-play.jpg"/>

                            <div className="section-app__item-qr-code">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=https://play.google.com/store/apps/details?id=ad.wise.win&amp;size=300x300`}/>
                            </div>
                        </a>

                        <a href="https://apps.apple.com/ru/app/adwise-cards/id1537570348" target="_blank" className="section-app__item">
                            <img src="/img/app/app-store.jpg"/>

                            <div className="section-app__item-qr-code">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=https://apps.apple.com/ru/app/adwise-cards/id1537570348&amp;size=300x300`}/>
                            </div>
                        </a>

                    </div>
                </div>

                <div className="section-logo">
                    <svg width="382" height="86" viewBox="0 0 382 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.7374 45.2567L16.2993 23.4576C14.0098 20.2475 10.3971 18.5271 6.74237 18.5271C4.41089 18.5271 2.03741 19.2195 0 20.6671L27.3685 59.2928L31.6324 65.2933L31.7164 65.4192C31.7374 65.3982 31.7374 65.3982 31.7584 65.3982C31.8004 65.3563 31.8424 65.3353 31.8844 65.2933L36.1483 59.2928C37.1565 55.9569 36.6734 52.2013 34.51 49.1381L31.7374 45.2567Z" fill="#ED8E00"/>
                        <path d="M40.3295 40.7867L44.5933 46.7872L44.6774 46.8921L44.7614 46.7872L49.0042 40.7867L49.2143 40.493L58.0361 28.0304L66.8579 40.493L67.0679 40.7867L71.3108 46.7872L71.3948 46.8921L71.4788 46.7872L75.7427 40.7867L75.9527 40.493L103.09 2.14004C101.032 0.692367 98.6793 0 96.3269 0C92.6511 0 89.0384 1.72043 86.7699 4.93049L71.3948 26.6456L65.1985 17.8966L58.0361 7.78388L50.8736 17.8966L44.6564 26.6456L29.2602 4.93049C26.9708 1.72043 23.358 0 19.7033 0C17.3718 0 14.9984 0.692367 12.9609 2.14004L40.1194 40.472L40.3295 40.7867Z" fill="#8152E4"/>
                        <path d="M109.305 18.5051C105.63 18.5051 102.017 20.2256 99.7485 23.4356L84.3103 45.2347L81.5588 49.1161C79.3743 52.1793 78.8912 55.9349 79.9204 59.2709L84.1843 65.2714C84.2263 65.3133 84.2683 65.3343 84.3103 65.3763C84.3313 65.3763 84.3313 65.3973 84.3524 65.3973L84.4364 65.2714L88.7002 59.2709L116.048 20.6662C113.989 19.1975 111.637 18.5051 109.305 18.5051Z" fill="#ED8E00"/>
                        <path d="M71.4565 64.0754L65.3233 55.4104L58.1608 45.2976L58.0348 45.4655L57.9088 45.2976L50.7463 55.4104L44.6131 64.0754L41.8615 67.9569C39.6771 71.0201 39.194 74.7757 40.2232 78.1116L44.487 84.1121C44.5291 84.1541 44.5711 84.1751 44.6131 84.217C44.6341 84.238 44.6341 84.238 44.6551 84.238L44.7391 84.1121L49.003 78.1116L57.9298 65.5231L58.0558 65.3553L58.1818 65.5231L67.1086 78.1116L71.3725 84.1121L71.4565 84.238C71.4775 84.217 71.4775 84.217 71.4985 84.217C71.5406 84.1751 71.5826 84.1541 71.6246 84.1121L75.8884 78.1116C76.8966 74.7757 76.4135 71.0201 74.2501 67.9569L71.4565 64.0754Z" fill="#8152E4"/>
                        <path d="M189.476 64.7363H181.868L178 53.8406H154.984L151.116 64.7363H143.83L160.335 19.6063H172.971L189.476 64.7363ZM166.524 21.6693L157.305 47.458H175.679L166.524 21.6693ZM219.014 41.3332V17.0274H225.783V64.7363H219.014V55.1945C217.982 58.3322 216.306 60.8251 213.985 62.6732C211.707 64.4784 209.021 65.381 205.926 65.381C201.671 65.381 198.125 63.7478 195.288 60.4812C192.451 57.2146 191.033 53.1529 191.033 48.2961C191.033 43.4392 192.451 39.3775 195.288 36.111C198.125 32.8014 201.671 31.1467 205.926 31.1467C209.021 31.1467 211.707 32.0707 213.985 33.9189C216.306 35.7241 217.982 38.1955 219.014 41.3332ZM208.182 59.1273C211.32 59.1273 213.899 58.0958 215.919 56.0327C217.982 53.9696 219.014 51.3907 219.014 48.2961C219.014 45.1585 217.982 42.5581 215.919 40.495C213.899 38.4319 211.32 37.4004 208.182 37.4004C205.346 37.4004 202.939 38.4534 200.962 40.5595C198.984 42.6226 197.996 45.2015 197.996 48.2961C197.996 51.3477 198.984 53.9266 200.962 56.0327C202.939 58.0958 205.346 59.1273 208.182 59.1273ZM278.761 62.6732L287.593 19.6063H294.814L285.466 64.7363H271.927L263.545 21.7338L255.164 64.7363H241.818L232.47 19.6063H239.626L248.588 62.8022L256.969 19.6063H270.315L278.761 62.6732ZM300.309 25.2797C299.492 24.4631 299.084 23.4745 299.084 22.3141C299.084 21.1536 299.492 20.165 300.309 19.3484C301.168 18.5317 302.178 18.1234 303.339 18.1234C304.499 18.1234 305.488 18.5317 306.305 19.3484C307.121 20.165 307.53 21.1536 307.53 22.3141C307.53 23.4745 307.121 24.4631 306.305 25.2797C305.488 26.0964 304.499 26.5047 303.339 26.5047C302.178 26.5047 301.168 26.0964 300.309 25.2797ZM306.691 64.7363H299.922V31.7914H306.691V64.7363ZM312.343 56.0327L319.112 54.6143C319.714 58.1387 322.121 59.901 326.333 59.901C328.482 59.901 330.201 59.4926 331.491 58.676C332.823 57.8164 333.489 56.7419 333.489 55.4524C333.489 54.077 332.802 53.0455 331.426 52.3578C330.051 51.6271 328.375 51.1113 326.398 50.8105C324.42 50.4666 322.422 50.0583 320.402 49.5855C318.425 49.1127 316.748 48.1886 315.373 46.8132C313.997 45.3949 313.31 43.5037 313.31 41.1397C313.31 38.26 314.535 35.8746 316.985 33.9834C319.478 32.0922 322.594 31.1467 326.333 31.1467C330.072 31.1467 333.124 31.9848 335.488 33.661C337.895 35.3373 339.335 37.6153 339.808 40.495L333.038 41.9134C332.522 38.389 330.287 36.6267 326.333 36.6267C324.528 36.6267 323.045 37.0136 321.885 37.7872C320.724 38.5609 320.144 39.5709 320.144 40.8174C320.144 41.9349 320.638 42.8375 321.627 43.5252C322.615 44.2129 323.862 44.6642 325.366 44.8791C326.87 45.094 328.482 45.4164 330.201 45.8462C331.964 46.276 333.597 46.7703 335.101 47.329C336.606 47.8448 337.852 48.7904 338.841 50.1658C339.829 51.5412 340.323 53.2604 340.323 55.3235C340.323 58.2032 338.969 60.6101 336.262 62.5443C333.597 64.4355 330.287 65.381 326.333 65.381C322.422 65.381 319.241 64.5429 316.791 62.8667C314.341 61.1904 312.858 58.9124 312.343 56.0327ZM361.869 31.1467C367.156 31.1467 371.454 33.0378 374.763 36.8202C378.073 40.6025 379.427 45.18 378.825 50.5526H351.554C352.026 53.2174 353.251 55.388 355.228 57.0642C357.206 58.6975 359.591 59.5141 362.385 59.5141C364.534 59.5141 366.446 58.9984 368.123 57.9668C369.842 56.8923 371.174 55.4524 372.12 53.6472L377.793 56.1616C376.332 58.9554 374.247 61.1904 371.54 62.8667C368.832 64.5429 365.716 65.381 362.191 65.381C357.248 65.381 353.101 63.7478 349.748 60.4812C346.396 57.2146 344.72 53.1529 344.72 48.2961C344.72 43.4392 346.353 39.3775 349.619 36.111C352.929 32.8014 357.012 31.1467 361.869 31.1467ZM361.869 37.0136C359.376 37.0136 357.206 37.7872 355.357 39.3345C353.552 40.8389 352.349 42.816 351.747 45.2659H371.991C371.432 42.816 370.229 40.8389 368.381 39.3345C366.575 37.7872 364.405 37.0136 361.869 37.0136Z" fill="#25233E"/>
                    </svg>

                    <h1>Нравится это? Рекомендуй!</h1>
                </div>

            </section>
        );
    }
}

export default UsersStage
