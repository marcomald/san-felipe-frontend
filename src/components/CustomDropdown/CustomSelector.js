import React from 'react'
import Select from 'react-select'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const customStyles = {
    option: (provided, { data, isDisabled, isFocused, isSelected }) => ({
        ...provided,
        color: isSelected ? "white" : "black",
        '&:hover': {
            background: 'linear-gradient(60deg, #ec407a, #d81b60)',
            color: "white"
        },
        background: isSelected ? 'linear-gradient(60deg, #ec407a, #d81b60)' : "white",

    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: "#3C4858",
        fontWeight: 400,
        '&:hover': {
            background: 'linear-gradient(60deg, #ec407a, #d81b60)',
            color: "white"
        },
    }),
    control: (provided, state) => ({
        ...provided,
        border: "none",
        borderRadius: "0",
        borderBottom: "1px solid #D2D2D2",
        boxShadow: "none",
        fontSize: ".8rem"
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: "#3C4858",
        fontWeight: 400,
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        padding: 0,
    }),

}

export default function Selector() {
    return <Select options={options} styles={customStyles} />
}