/* eslint-disable react/prop-types */
import React from "react";
import Select from "react-select";

const customStyles = {
  option: (provided, { isSelected }) => ({
    ...provided,
    color: isSelected ? "white" : "black",
    "&:hover": {
      background: "#4054B2",
      color: "white"
    },
    background: isSelected ? "#4054B2" : "white",
    zIndex: 100
  }),
  singleValue: provided => ({
    ...provided,
    color: "#3C4858",
    fontWeight: 400,
    "&:hover": {
      background: "#4054B2",
      color: "white"
    }
  }),
  control: provided => ({
    ...provided,
    border: "none",
    borderRadius: "0",
    borderBottom: "1px solid #D2D2D2",
    boxShadow: "none",
    fontSize: ".8rem",
    marginTop: "2rem",
    zIndex: 100
  }),
  placeholder: provided => ({
    ...provided,
    color: "#AAAAAA",
    fontWeight: 400
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0,
    zIndex: 10000
  }),
  menu: provided => ({
    ...provided,
    zIndex: 10000
  })
};

export default function Selector(props) {
  return (
    <React.Fragment>
      {props.value && (
        <label className="custom-label-2">{props.placeholder}</label>
      )}
      <Select
        onChange={props.onChange}
        onInputChange={props.onInputChange}
        styles={customStyles}
        options={props.options}
        placeholder={props.placeholder}
        isMulti={props.isMulti ? true : false}
        value={props.value ? props.value : ""}
        isDisabled={props.disabled ? true : false}
      />
    </React.Fragment>
  );
}
