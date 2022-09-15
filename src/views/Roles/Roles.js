import React, { useEffect } from "react";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
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
import Axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import AdminLayout from "layouts/Admin";
import { Settings } from "@material-ui/icons";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Roles(props) {
  const classes = useStyles();
  const classesTable = useTableStyles();
  const [modal, setModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [notification, setNotification] = React.useState({
    color: "info",
    text: "",
    open: false
  });
  const [reloadData, setReloadData] = React.useState(false);
  const [roles, setRoles] = React.useState({ roles: [], total: 0 });
  const [rolEdit, setRolEdit] = React.useState({});
  const [rolEditAux, setRolEditAux] = React.useState({});
  const [rol, setRol] = React.useState({});
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(3);
  const modalClasses = useStylesModal();
  const permisos = [
    { name: "Acceso a Clientes", key: "clientes" },
    { name: "Acceso a Pedidos", key: "pedidos" },
    { name: "Acceso a Roles", key: "roles" },
    { name: "Acceso a Usuarios", key: "usuarios" },
    { name: "Acceso a Perfil", key: "userprofile" }
  ];

  useEffect(() => {
    const limite = limit ? "&limit=" + limit : "";
    Axios.get("/roles?" + limite)
      .then(response => {
        setRoles(response.data);
      })
      .catch(e => {
        console.error(e);
        if (e.request.status === 403) {
          props.history.push("/login");
          return;
        }
      });
  }, [reloadData, props, limit]);

  useEffect(() => {
    const limite = limit ? "&limit=" + limit : "";
    const offsetV = offset ? "&offset=" + offset : "";
    Axios.get("/roles?" + limite + offsetV)
      .then(response => {
        setRoles(response.data);
      })
      .catch(e => {
        console.error(e);
        if (e.request.status === 403) {
          props.history.push("/login");
          return;
        }
      });
  }, [reloadData, props.history, offset, limit]);

  const fillButtons = rl => {
    return [{ color: "rose", icon: Edit }].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title="Editar rol"
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classesTable.actionButton}
            key={key}
            onClick={() => {
              setRolEdit({
                ...rl,
                permisos: rl.permisos.map(per => {
                  const aux = permisos.filter(pe => pe.key === per)[0];
                  return {
                    value: aux.key,
                    label: aux.name
                  };
                })
              });
              setRolEditAux({
                ...rl,
                permisos: rl.permisos.map(per => {
                  const aux = permisos.filter(pe => pe.key === per)[0];
                  return {
                    value: aux.key,
                    label: aux.name
                  };
                })
              });
              setEditModal(true);
            }}
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const handleRolChange = (property, value) => {
    const newRol = { ...rol };
    newRol[property] = value;
    setRol(newRol);
  };

  const handleEditRolChange = (property, value) => {
    const newRol = { ...rolEdit };
    newRol[property] = value;
    setRolEdit(newRol);
  };

  const createRol = () => {
    Axios.post("/roles", {
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: rol.permisos.map(per => per.value)
    })
      .then(async data => {
        const response = await data.data;
        setLoading(false);
        if (response.errors) {
          setNotification({
            color: "danger",
            text: "Se encontraron algunos errores al crear rol.",
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
            text: "Exito! Rol ingresado..",
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
        console.error("Error al crear rol: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Se produjo un error al crear rol.",
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

  const updateRol = () => {
    Axios.put("/roles", {
      id: rolEdit.id,
      nombre: rolEdit.nombre,
      descripcion: rolEdit.descripcion,
      permisos: rolEdit.permisos.map(per => per.value)
    })
      .then(async data => {
        const response = await data.data;
        setLoading(false);
        if (response.errors) {
          setNotification({
            color: "danger",
            text: "Se encontraron algunos errores al editar rol.",
            open: true
          });
          setTimeout(function() {
            setNotification({
              ...notification,
              open: false
            });
          }, 10000);
        } else {
          setEditModal(false);
          setNotification({
            color: "info",
            text: "Exito! Rol editado.",
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
        console.error("Error al editar rol: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Se produjo un error al editar rol.",
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
      <GridContainer>
        <GridItem xs={12} sm={6}>
          <h1>
            Administración de <b>Roles.</b>
          </h1>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              key="AddButton1"
              onClick={() => setModal(true)}
            >
              <Add /> Agregar Rol
            </Button>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <Settings />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Roles registrados</h4>
            </CardHeader>
            <CardBody>
              <CustomTable
                data={roles.roles.map((rl, index) => {
                  return [
                    rl.nombre,
                    rl.descripcion,
                    <ul>
                      {rl.permisos.map((per, index) => {
                        return <li key={index}>{per}</li>;
                      })}
                    </ul>,
                    fillButtons(rl)
                  ];
                })}
                limite={10}
                headers={["Nombre", "Descripcion", "Permisos", "Acciones"]}
                onOffsetChange={valueOffset => {
                  setOffset(valueOffset);
                }}
                total={roles.total}
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
          <h3 className={modalClasses.modalTitle}>Ingreso de nuevo rol</h3>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={modalClasses.modalBody}
        >
          <form>
            <CustomInput
              labelText="Nombre"
              id="name_rol"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text"
              }}
              value={rol.nombre}
              onChange={e => handleRolChange("nombre", e.target.value)}
            />
            <CustomInput
              labelText="Descripcion"
              id="description_rol"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text"
              }}
              value={rol.descripcion}
              onChange={e => handleRolChange("descripcion", e.target.value)}
            />
            <br />
            <br />
            <Selector
              placeholder="Permisos"
              options={permisos.map(per => {
                return {
                  value: per.key,
                  label: per.name
                };
              })}
              isMulti
              onChange={value => handleRolChange("permisos", value)}
              value={rol.permisos}
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
              !rol.nombre ||
              rol.nombre === "" ||
              !rol.descripcion ||
              rol.descripcion === "" ||
              !rol.permisos ||
              rol.permisos.length === 0
            }
            onClick={createRol}
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
            Editar rol <b>{rolEditAux.nombre}</b>
          </h3>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={modalClasses.modalBody}
        >
          <form>
            <CustomInput
              labelText="Nombre"
              id="name_rol_edit"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text"
              }}
              value={rolEdit.nombre}
              onChange={e => handleEditRolChange("nombre", e.target.value)}
            />
            <CustomInput
              labelText="Descripcion"
              id="description_rol_edit"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text"
              }}
              value={rolEdit.descripcion}
              onChange={e => handleEditRolChange("descripcion", e.target.value)}
            />
            <br />
            <br />
            <Selector
              placeholder="Permisos"
              options={permisos.map(per => {
                return {
                  value: per.key,
                  label: per.name
                };
              })}
              isMulti
              onChange={value => handleEditRolChange("permisos", value)}
              value={rolEdit.permisos}
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
              !rolEdit.nombre ||
              rolEdit.nombre === "" ||
              !rolEdit.descripcion ||
              rolEdit.descripcion === "" ||
              !rolEdit.permisos ||
              rolEdit.permisos.length === 0
            }
            onClick={updateRol}
          >
            Actualizar
          </Button>
          <Button onClick={() => setEditModal(false)}>Cancelar</Button>
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
    </AdminLayout>
  );
}
