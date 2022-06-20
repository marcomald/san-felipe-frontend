import React from "react";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  option: (provided, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    color: isSelected ? "white" : "black",
    "&:hover": {
      background: "#4054B2",
      color: "white"
    },
    background: isSelected ? "#4054B2" : "white"
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#3C4858",
    fontWeight: 400,
    "&:hover": {
      background: "#4054B2",
      color: "white"
    }
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
    fontWeight: 400
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: 0
  })
};

export default function CreatableSelecttor(props) {
  return (
    <CreatableSelect
      isClearable
      onChange={props.onChange}
      onInputChange={props.onInputChange}
      styles={customStyles}
      options={props.options}
      placeholder={props.placeholder}
      value={props.value ? props.value : ""}
      // input
    />
  );
}
