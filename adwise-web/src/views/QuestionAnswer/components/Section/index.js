import React, { useState } from "react";

const Section = (props) => {
    const { title, items } = props;

    return (
        <div className="section">

            <div className="section__title">{title}</div>

            <div className="section__items">

                {
                    items.map((item, idx) => (
                        <>

                            <Item
                                title={item.question}
                                message={item.answer}
                            />

                            <div className="section__items-separate"/>

                        </>
                    ))
                }

            </div>

        </div>
    )
}

const Item = (props) => {
    const { title, message } = props;
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="section__item">
            <div className="section__item-header" onClick={() => setOpen(!isOpen)}>
                <div className="section__item-title" dangerouslySetInnerHTML={{__html: title}}/>

                <div className="">
                    {
                        isOpen ? (
                            <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9L8.5 2L16 9" stroke="#8152E4" strokeWidth="2"/>
                            </svg>
                        ) : (
                            <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L8.5 8L16 1" stroke="#8152E4" strokeWidth="2"/>
                            </svg>
                        )
                    }
                </div>
            </div>

            {
                isOpen && (
                    <div className="section__item-body">
                        <div className="section__item-message" dangerouslySetInnerHTML={{__html: message}}/>
                    </div>
                )
            }
        </div>
    )
}

export default Section
