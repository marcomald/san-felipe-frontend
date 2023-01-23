import React, { useEffect } from "react";
import IconPerson from "@material-ui/icons/Person";
import IconSecurity from "@material-ui/icons/Security";

import Axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { makeStyles } from "@material-ui/core/styles";
import AdminLayout from "layouts/Admin";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput";
// import Selector from "components/CustomDropdown/CustomSelector";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Loader from "components/Loader/Loader.js";
import { getUserId } from "helpers/utils";
import { validateEmail } from "../../helpers/validations";
import Snackbar from "components/Snackbar/Snackbar.js";
import Button from "components/CustomButtons/Button.js";

const customStyles = {
  ...styles,
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%"
  }
};

const useStyles = makeStyles(customStyles);
export default function UserProfile(props) {
  const [user, setUser] = React.useState({});
  // const [roles, setRoles] = React.useState([]);
  const [reloadData, setReloadData] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [notification, setNotification] = React.useState({
    color: "info",
    text: "",
    open: false
  });

  const userSession = window.localStorage.getItem("user");
  const userDecode = JSON.parse(window.atob(userSession));
  const classes = useStyles();

  useEffect(() => {
    // Axios.get("/roles")
    //     .then(async response => {
    //         const rolesAux = await response.data.roles.map(r => {
    //             return {
    //                 value: r.id,
    //                 label: r.nombre
    //             }
    //         })
    //         setRoles(rolesAux)
    //     }).catch(e => {
    //         console.error(e)
    //         if (e.request.status === 403) {
    //             props.history.push('/login');
    //             return
    //         }
    //     })
    Axios.get("/users/" + getUserId())
      .then(async response => {
        const userResponse = await response.data;
        userResponse.rol = {
          value: userResponse.rol.id,
          label: userResponse.rol.nombre
        };
        userResponse.password = "";
        userResponse.passwordConfirmation = "";
        setUser(userResponse);
      })
      .catch(e => {
        console.error(e);
        if (e.request.status === 403) {
          props.history.push("/login");
          return;
        }
      });
  }, [reloadData, props]);

  const updateUser = () => {
    if (!validateEmail(user.email)) {
      setNotification({
        color: "danger",
        text: "Error! El campo email no tiene el formato correcto.",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
      return;
    }

    if (user.passwordConfirmation !== user.password) {
      setNotification({
        color: "danger",
        text: "Error! Las contrasenas no coinciden, vuelva a ingresarlas.",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
      return;
    }

    Axios.put("/users", {
      id: getUserId(),
      nombre_completo: user.nombre_completo,
      nombre_usuario: "",
      email: user.email,
      estado: user.estado,
      rolId: user.rol.value,
      userId: getUserId()
    })
      .then(async data => {
        const response = await data.data;
        setLoading(false);
        if (response.errors) {
          setNotification({
            color: "danger",
            text: "Error! Al crear usuario.",
            open: true
          });
          setTimeout(function() {
            setNotification({
              ...notification,
              open: false
            });
          }, 10000);
        } else {
          setNotification({
            color: "info",
            text: "Exito! Usuario ingresado.",
            open: true
          });
          setTimeout(function() {
            setNotification({
              ...notification,
              open: false
            });
          }, 6000);
          setReloadData(!reloadData);
        }
      })
      .catch(err => {
        console.error("Error al crear usuario: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Error! Al crear usuario.",
          open: true
        });
        setTimeout(function() {
          setNotification({
            ...notification,
            open: false
          });
        }, 10000);
      });
  };

  const updatePasswordUser = () => {
    if (user.passwordConfirmation !== user.password) {
      setNotification({
        color: "danger",
        text: "Error! Las contrasenas no coinciden, vuelva a ingresarlas.",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
      return;
    }

    Axios.put("/users/password", {
      id: getUserId(),
      password: user.password,
      userId: getUserId()
    })
      .then(async data => {
        setLoading(false);
        setNotification({
          color: "info",
          text: "Exito! Contrasena actualizada.",
          open: true
        });
        setTimeout(function() {
          setNotification({
            ...notification,
            open: false
          });
        }, 6000);
        setReloadData(!reloadData);
      })
      .catch(err => {
        console.error("Error al actualizar contrasena: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Se produjo un error al actualizar la contrasena.",
          open: true
        });
        setTimeout(function() {
          setNotification({
            ...notification,
            open: false
          });
        }, 10000);
      });
  };

  const handleUserChange = (property, value) => {
    const newUser = { ...user };
    newUser[property] = value;
    setUser(newUser);
  };

  return (
    <AdminLayout>
      <h1>
        Perfil de usuario: <b>{userDecode.userName}</b>
      </h1>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <IconPerson />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Informacion del usuario</h4>
            </CardHeader>
            <CardBody>
              <form>
                <CustomInput
                  labelText="Nombre Completo"
                  id="name_user"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text"
                  }}
                  value={user.nombre_completo}
                  onChange={e =>
                    handleUserChange("nombre_completo", e.target.value)
                  }
                />
                <CustomInput
                  labelText="Email"
                  id="email_user"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "email"
                  }}
                  value={user.email}
                  onChange={e => handleUserChange("email", e.target.value)}
                />
                <br />
                <br />
                {/* <Selector
                                    placeholder="Roles"
                                    options={roles}
                                    onChange={(value) => handleUserChange("rol", value)}
                                    value={user.rol}
                                /> */}
                {/* <br />
                                <br /> */}
                <Button
                  color="rose"
                  disabled={
                    !user.nombre_completo ||
                    user.nombre_completo === "" ||
                    !user.email ||
                    user.email === "" ||
                    !user.rol ||
                    !user.rol.value ||
                    user.rol.value === ""
                  }
                  onClick={updateUser}
                >
                  Actualizar
                </Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <br />
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <IconSecurity />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Reinicio de contrasena</h4>
            </CardHeader>
            <CardBody>
              <form>
                <CustomInput
                  labelText="Contrasena"
                  id="password_user"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password"
                  }}
                  value={user.password}
                  onChange={e => handleUserChange("password", e.target.value)}
                />
                <CustomInput
                  labelText="Confirmar Contrasena"
                  id="password_confirmation_user"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password"
                  }}
                  value={user.passwordConfirmation}
                  onChange={e =>
                    handleUserChange("passwordConfirmation", e.target.value)
                  }
                />
                <Button
                  color="rose"
                  disabled={
                    !user.password ||
                    user.password === "" ||
                    !user.passwordConfirmation ||
                    user.passwordConfirmation === ""
                  }
                  onClick={updatePasswordUser}
                >
                  Actualizar Contrasena
                </Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {loading && <Loader show={loading} />}
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
    </AdminLayout>
  );
}
