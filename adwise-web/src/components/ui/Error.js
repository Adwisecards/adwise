import React from 'react';

const Error = ({message, onClose}) => {
    return (
        <div onClick={onClose} className='error'>
            <span className='error__header'>Error!</span>
            <div className='error__body'>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Error;