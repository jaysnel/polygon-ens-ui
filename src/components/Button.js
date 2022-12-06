import React from 'react'

export default function Button(props) {
    const {buttonText, buttonFunction, buttonStyles} = props;

    return (
        <button 
        className={`${buttonStyles}`}
        onClick={() =>  buttonFunction ? buttonFunction() : undefined}>{buttonText}</button>
    )
}
