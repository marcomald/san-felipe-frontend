import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import customCheckboxRadioSwitch from "../../assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles(customCheckboxRadioSwitch);

export default function CustomCheckBox(props) {
  const classes = useStyles();
  const { onClick, labelText, checked } = props;
  return (
    <FormControlLabel
      classes={{
        root: classes.checkboxLabelControl,
        label: classes.checkboxLabel
      }}
      control={
        <Checkbox
          checked={checked}
          onClick={onClick}
          checkedIcon={<Check className={classes.checkedIcon} />}
          icon={<Check className={classes.uncheckedIcon} />}
          classes={{
            checked: classes.checked,
            root: classes.checkRoot
          }}
        />
      }
      label={<span>{labelText}</span>}
    />
  );
}

CustomCheckBox.propTypes = {
  labelText: PropTypes.node,
  onClick: PropTypes.func,
  checked: PropTypes.bool
};
