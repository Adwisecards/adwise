import React from "react";

const Stage = (props) => {
    const { number, title, image } = props;

    return (
        <div className="stage">
            <div className="stage__left">
                <div className="stage__number">{number}</div>
                <div className="stage__title" dangerouslySetInnerHTML={{__html: title}}/>
            </div>
            <div className="stage__right">
                <img src={image}/>
            </div>
        </div>
    )
};

export default Stage
