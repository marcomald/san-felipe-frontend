import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-dashboard-pro-react/layouts/authStyle.js";
import tuentiBg from "assets/img/tuentiFondo.jpeg";

const useStyles = makeStyles(styles);

export default function Pages({ children }) {
  const wrapper = React.createRef();
  const classes = useStyles();

  React.useEffect(() => {
    document.body.style.overflow = "unset";
    return function cleanup() { };
  });

  return (
    <div>
      <div className={classes.wrapper} ref={wrapper}>
        <div
          className={classes.fullPage}
          style={{ backgroundImage: "url(" + tuentiBg + ")" }}
        >
          {children}
          <Footer white />
        </div>
      </div>
    </div>
  );
}
