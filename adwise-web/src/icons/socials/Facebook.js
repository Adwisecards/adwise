import React from 'react'

const Facebook = (props) =>{
    return(
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.85291 10.9782V18.8383H7.3678V10.9782H9.98858L10.4873 7.72689H7.3678V5.61796C7.3678 4.72825 7.80276 3.86051 9.19993 3.86051H10.6191V1.09254C10.6191 1.09254 9.33174 0.872864 8.10153 0.872864C5.53127 0.872864 3.85291 2.4304 3.85291 5.24889V7.72689H0.99707V10.9782H3.85291Z" fill={props.color}/>
        </svg>

    )
} 
Facebook.defaultProps = {
    color: 'white'
}
export default Facebook