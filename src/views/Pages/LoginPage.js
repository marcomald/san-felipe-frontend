import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Axios from "axios";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import AuthContext from "../../authContext";
import AuthLayout from "../../layouts/Auth";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reloadLogin] = useState(true);
  const [notification, setNotification] = React.useState({
    color: "info",
    text: "",
    open: false
  });

  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const classes = useStyles();

  useEffect(() => {
    window.sessionStorage.removeItem("user");
    window.sessionStorage.removeItem("accessToken");
  }, [reloadLogin]);

  return (
    <AuthLayout>
      <AuthContext.Consumer>
        {context => (
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={6} md={4}>
                <form>
                  <Card login className={classes[cardAnimaton]}>
                    <CardHeader
                      className={`${classes.cardHeader} ${classes.textCenter}`}
                      color="info"
                    >
                      <h4 className={classes.cardTitle}>Inicio de Sesion</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          )
                        }}
                        onChange={e => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputAdornmentIcon}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          type: "password",
                          autoComplete: "off"
                        }}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.justifyContentCenter}>
                      <Button
                        color="info"
                        simple
                        size="lg"
                        onClick={() => {
                          // eslint-disable-next-line react/prop-types
                          Axios.post("/auth/login", {
                            username: email,
                            password
                          })
                            .then(async data => {
                              const response = await data.data;
                              const user = JSON.stringify(response.user);
                              const userEncode = window.btoa(user);
                              window.sessionStorage.setItem("user", userEncode);
                              window.sessionStorage.setItem(
                                "accessToken",
                                response.access_token
                              );
                              context.onSetLogin({
                                token: response.access_token,
                                user: response.user
                              });
                              // eslint-disable-next-line react/prop-types
                              props.history.push("/inicio");
                            })
                            .catch(() => {
                              setNotification({
                                color: "danger",
                                text:
                                  "Email o contrasena incorrecta, por favor intentelo de nuevo.",
                                open: true
                              });
                              setTimeout(function() {
                                setNotification({
                                  ...notification,
                                  open: false
                                });
                              }, 10000);
                            });
                        }}
                      >
                        Ingresar
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </GridItem>
            </GridContainer>
            <Snackbar
              place="br"
              color={notification.color}
              message={notification.text}
              open={notification.open}
              closeNotification={() => {
                const noti = { ...notification, open: false };
                setNotification(noti);
              }}
              close
            />
          </div>
        )}
      </AuthContext.Consumer>
    </AuthLayout>
  );
}
