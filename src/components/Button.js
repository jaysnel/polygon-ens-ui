import React from 'react'

export default function Button(props) {
    const {buttonText, buttonFunction, buttonStyles} = props;

    return (
        <button 
        className={`
        min-w-full hover:cursor-pointer px-5 py-3 text-lg
        ${buttonStyles}`}
        onClick={() =>  buttonFunction ? buttonFunction() : undefined}>{buttonText}</button>
    )
}
