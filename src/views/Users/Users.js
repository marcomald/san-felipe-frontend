import React, { useEffect } from "react";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import Settings from "@material-ui/icons/Settings";
// Components
import { makeStyles } from "@material-ui/core/styles";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomTable from "components/Table/CustomTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Loader from "components/Loader/Loader.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomInput from "components/CustomInput/CustomInput";
import Selector from "components/CustomDropdown/CustomSelector";
import { validateEmail } from "../../helpers/validations";
import Axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import AdminLayout from "../../layouts/Admin";
import { getUserId } from "helpers/utils";
import { Group } from "@material-ui/icons";

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
const useStylesModal = makeStyles(Modalstyles);
const useTableStyles = makeStyles(TableStyles);
// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Usuarios(props) {
  const classes = useStyles();
  const classesTable = useTableStyles();
  const [modal, setModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [editPasswordModal, setEditPasswordModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [reloadData, setReloadData] = React.useState(false);
  const [users, setUsers] = React.useState({ users: [], total: 0 });
  const [userEdit, setUserEdit] = React.useState({});
  const [userEditAux, setUserEditAux] = React.useState({});
  const [user, setUser] = React.useState({});
  const [roles, setRoles] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [notification, setNotification] = React.useState({
    color: "info",
    text: "",
    open: false
  });
  const modalClasses = useStylesModal();

  useEffect(() => {
    Axios.get("/roles")
      .then(async response => {
        const rolesAux = await response.data.roles.map(r => {
          return {
            value: r.id,
            label: r.nombre
          };
        });
        setRoles(rolesAux);
      })
      .catch(e => {
        console.error(e);
        if (e.request.status === 403) {
          // eslint-disable-next-line react/prop-types
          props.history.push("/login");
          return;
        }
      });

    const limite = limit ? "&limit=" + limit : "";
    Axios.get("/users?" + limite)
      .then(async response => {
        setUsers(response.data);
      })
      .catch(e => {
        console.error(e);
        if (e?.request?.status === 403) {
          props.history.push("/login");
          return;
        }
      });
  }, [reloadData, props, limit]);

  useEffect(() => {
    const limite = limit ? "&limit=" + limit : "";
    const offsetV = offset ? "&offset=" + offset : "";
    Axios.get("/users?" + limite + offsetV)
      .then(response => {
        setUsers(response.data);
      })
      .catch(e => {
        console.error(e);
        if (e?.request?.status === 403) {
          props.history.push("/login");
          return;
        }
      });
    // eslint-disable-next-line react/prop-types
  }, [reloadData, props.history, offset, limit]);

  const handleUserChange = (property, value) => {
    const newUser = { ...user };
    newUser[property] = value;
    setUser(newUser);
  };

  const handleEditUserChange = (property, value) => {
    const newUser = { ...userEdit };
    newUser[property] = value;
    setUserEdit(newUser);
  };

  const fillButtons = us => {
    return [
      { color: "rose", icon: Settings },
      { color: "info", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger"
              ? "Eliminar usuario"
              : prop.color === "rose"
              ? "Editar usuario"
              : "Cambiar contrasena"
          }
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classesTable.actionButton}
            key={key}
            onClick={() => {
              const userSelected = us;
              setUserEdit({
                ...userSelected,
                nombre_completo: userSelected.nombre_completo,
                email: userSelected.email,
                estado: {
                  value: userSelected.estado,
                  label:
                    userSelected.estado === "activo" ? "Activo" : "Inactivo"
                },
                rol: {
                  value: userSelected.rol_id,
                  label: userSelected.rol_nombre
                }
              });
              setUserEditAux({
                ...userSelected,
                nombre_completo: userSelected.nombre_completo,
                email: userSelected.email,
                estado: {
                  value: userSelected.estado,
                  label:
                    userSelected.estado === "activo" ? "Activo" : "Inactivo"
                },
                rol: {
                  value: userSelected.rol_id,
                  label: userSelected.rol_nombre
                }
              });
              prop.color === "danger"
                ? setDeleteModal(true)
                : prop.color === "rose"
                ? setEditModal(true)
                : setEditPasswordModal(true);
            }}
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const createUser = () => {
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

    Axios.post("/users", {
      nombre_completo: user.nombre_completo,
      nombre_usuario: user.email,
      email: user.email,
      password: user.password,
      rolId: user.rol.value,
      userId: getUserId(),
      vendedor: user.rol.label.toUpperCase() === "VENDEDOR"
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
          setModal(false);
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

  const deleteUser = () => {
    Axios.delete("/users/" + userEdit.id, {
      data: {
        id: userEdit.id,
        userId: getUserId()
      }
    })
      .then(() => {
        setDeleteModal(false);
        setReloadData(!reloadData);
        setNotification({
          color: "info",
          text: "Exito! Usuario eliminado.",
          open: true
        });
        setTimeout(function() {
          setNotification({
            ...notification,
            open: false
          });
        }, 6000);
      })
      .catch(err => {
        console.error("Error al eliminar usuario: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Se produjo un error al eliminar el usuario.",
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

  const updateUser = () => {
    if (!validateEmail(userEdit.email)) {
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

    Axios.put("/users", {
      id: userEdit.id,
      nombre_completo: userEdit.nombre_completo,
      nombre_usuario: userEdit.nombre_completo,
      email: userEdit.email,
      estado: userEdit.estado.value,
      rolId: userEdit.rol.value,
      userId: getUserId()
    })
      .then(() => {
        setLoading(false);
        setEditModal(false);
        setNotification({
          color: "info",
          text: "Exito! Usuario actualizado.",
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
        console.error("Error al actualizar usuario: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Se produjo un error al actualizar el usuario.",
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
    if (userEdit.passwordConfirmation !== userEdit.password) {
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
      id: userEdit.id,
      password: userEdit.password,
      userId: getUserId()
    })
      .then(async () => {
        setLoading(false);
        setEditPasswordModal(false);
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

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Administración de <b>Usuarios.</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                key="AddButton1"
                onClick={() => setModal(true)}
              >
                <Add /> Agregar Usuario
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Group />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Usuarios registrados</h4>
              </CardHeader>
              <CardBody>
                <CustomTable
                  data={
                    users &&
                    users.users.map(us => {
                      return [
                        us.nombre_completo,
                        us.email,
                        new Date(us.fecha_creacion).toLocaleDateString(),
                        us.rol_nombre,
                        us.estado.toUpperCase(),
                        fillButtons(us)
                      ];
                    })
                  }
                  limite={10}
                  headers={[
                    "Nombre Completo",
                    "Email",
                    "Fecha de Creacion",
                    "Rol",
                    "Estado",
                    "Acciones"
                  ]}
                  onOffsetChange={valueOffset => {
                    setOffset(valueOffset);
                  }}
                  total={users.total}
                  changeLimit={limite => {
                    setLimit(limite);
                  }}
                  offset={offset}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={modal}
          transition={Transition}
          keepMounted
          onClose={() => setModal(false)}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={modalClasses.modalHeader}
          >
            <h3 className={modalClasses.modalTitle}>
              Ingreso de nuevo usuario
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
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
              <br />
              <br />
              <Selector
                placeholder="Roles"
                options={roles}
                onChange={value => handleUserChange("rol", value)}
                value={user.rol}
              />
              <br />
              <br />
            </form>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              color="rose"
              disabled={
                !user.nombre_completo ||
                user.nombre_completo === "" ||
                !user.email ||
                user.email === "" ||
                !user.password ||
                user.password === "" ||
                !user.passwordConfirmation ||
                user.passwordConfirmation === "" ||
                !user.rol ||
                !user.rol.value ||
                user.rol.value === ""
              }
              onClick={createUser}
            >
              Ingresar
            </Button>
            <Button onClick={() => setModal(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={editModal}
          transition={Transition}
          keepMounted
          onClose={() => setEditModal(false)}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={modalClasses.modalHeader}
          >
            <h3 className={modalClasses.modalTitle}>
              Actualizar usuario <b>{userEditAux.nombre_completo}</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <form>
              <CustomInput
                labelText="Nombre Completo"
                id="name_edit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text"
                }}
                value={userEdit.nombre_completo}
                onChange={e =>
                  handleEditUserChange("nombre_completo", e.target.value)
                }
              />
              <CustomInput
                labelText="Email"
                id="email_edit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "email"
                }}
                value={userEdit.email}
                onChange={e => handleEditUserChange("email", e.target.value)}
              />
              <br />
              <Selector
                label="Rol"
                placeholder="Roles"
                options={roles}
                onChange={value => handleEditUserChange("rol", value)}
                value={userEdit.rol}
              />
              <br />
              <Selector
                label="Estado"
                placeholder="Estado"
                options={[
                  {
                    value: "activo",
                    label: "Activo"
                  },
                  { value: "inactivo", label: "Inactivo" }
                ]}
                onChange={value => handleEditUserChange("estado", value)}
                value={userEdit.estado}
              />
              <br />
              <br />
            </form>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              color="rose"
              disabled={
                !userEdit.nombre_completo ||
                userEdit.nombre_completo === "" ||
                !userEdit.email ||
                userEdit.email === "" ||
                !userEdit.estado ||
                !userEdit.estado.value ||
                userEdit.estado.value === "" ||
                !userEdit.rol ||
                !userEdit.rol.value ||
                userEdit.rol.value === ""
              }
              onClick={updateUser}
            >
              Actualizar
            </Button>
            <Button onClick={() => setEditModal(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={editPasswordModal}
          transition={Transition}
          keepMounted
          onClose={() => setEditPasswordModal(false)}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={modalClasses.modalHeader}
          >
            <h3 className={modalClasses.modalTitle}>
              Actualizar contrasena para usuario{" "}
              <b>{userEditAux.nombre_completo}</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <form>
              <CustomInput
                labelText="Contrasena"
                id="password_edit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "password"
                }}
                value={userEdit.password}
                onChange={e => handleEditUserChange("password", e.target.value)}
              />
              <CustomInput
                labelText="Confirmar Contrasena"
                id="password_confirmation_edit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "password"
                }}
                value={userEdit.passwordConfirmation}
                onChange={e =>
                  handleEditUserChange("passwordConfirmation", e.target.value)
                }
              />
              <br />
              <br />
            </form>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              color="rose"
              disabled={
                !userEdit.password ||
                userEdit.password === "" ||
                !userEdit.passwordConfirmation ||
                userEdit.passwordConfirmation === ""
              }
              onClick={updatePasswordUser}
            >
              Actualizar Contrasena
            </Button>
            <Button onClick={() => setEditPasswordModal(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={deleteModal}
          transition={Transition}
          keepMounted
          onClose={() => setDeleteModal(false)}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={modalClasses.modalHeader}
          >
            <h3 className={modalClasses.modalTitle}>
              Eliminar usuario <b>{userEditAux.nombre_completo}</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <h4>
              Esta seguro que desea <b>eliminar</b> el usuario?
            </h4>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button color="danger" onClick={deleteUser}>
              Eliminar
            </Button>
            <Button
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

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
      </React.Fragment>
    </AdminLayout>
  );
}
