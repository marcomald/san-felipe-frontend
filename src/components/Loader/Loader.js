import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./style.css";

const customStyles = {
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    position: "fixed",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  }
};
const useStyles = makeStyles(customStyles);
export default function LoaderComponent() {
  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <div className="loader"></div>
    </div>
  );
}
