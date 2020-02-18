import React, { useEffect } from "react";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
// Components
import { makeStyles } from "@material-ui/core/styles";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Loader from 'components/Loader/Loader.js'
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomInput from "components/CustomInput/CustomInput";
import Selector from "components/CustomDropdown/CustomSelector";
import Axios from 'axios';
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

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
        height: "100%",
    }
};

const useStyles = makeStyles(customStyles);
const useStylesModal = makeStyles(Modalstyles);
const useTableStyles = makeStyles(TableStyles);
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function Roles() {
    const classes = useStyles();
    const classesTable = useTableStyles();
    const [modal, setModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [notification, setNotification] = React.useState({
        color: "info",
        text: "",
        open: false,
    });
    const [reloadData, setReloadData] = React.useState(false);
    const [roles, setRoles] = React.useState([]);
    const [rolEdit, setRolEdit] = React.useState({});
    const [rolEditAux, setRolEditAux] = React.useState({});
    const [rol, setRol] = React.useState({});
    const modalClasses = useStylesModal();
    const permisos = [
        { name: "Acceso a Altas", key: "altas" },
        { name: "Acceso a Canales", key: "canales" },
        { name: "Acceso a Clientes", key: "clientes" },
        { name: "Acceso a Compras", key: "compras" },
        { name: "Acceso a Consumos", key: "consumos" },
        { name: "Acceso a Fast Tracks", key: "fasttrack" },
        { name: "Acceso a Roles", key: "roles" },
        { name: "Acceso a Usuarios", key: "usuarios" },
        { name: "Acceso a Vendedores", key: "vendedores" },
        { name: "Acceso a Ventas", key: "ventas" },
    ]
    useEffect(() => {
        Axios.get("http://localhost:3000/roles")
            .then(response => {
                setRoles(response.data)
            }).catch(e => {
                console.error(e)
            })
    }, [reloadData])

    const fillButtons = (indexRol) => {
        return [
            { color: "success", icon: Edit },
        ].map((prop, key) => {
            return (
                <Button
                    color={prop.color}
                    className={classesTable.actionButton}
                    key={key}
                    onClick={() => {
                        setRolEdit({
                            ...roles[indexRol],
                            permisos: roles[indexRol].permisos.map(per => {
                                const aux = permisos.filter(pe => pe.key === per)[0]
                                return {
                                    value: aux.key,
                                    label: aux.name,
                                }
                            })
                        })
                        setRolEditAux({
                            ...roles[indexRol],
                            permisos: roles[indexRol].permisos.map(per => {
                                const aux = permisos.filter(pe => pe.key === per)[0]
                                return {
                                    value: aux.key,
                                    label: aux.name,
                                }
                            })
                        })
                        setEditModal(true)
                    }}
                >
                    <prop.icon className={classesTable.icon} />
                </Button>
            );
        })
    };

    const handleRolChange = (property, value) => {
        const newRol = { ...rol };
        newRol[property] = value
        setRol(newRol);
    };

    const handleEditRolChange = (property, value) => {
        const newRol = { ...rolEdit };
        newRol[property] = value
        setRolEdit(newRol);
    };

    const createRol = () => {
        Axios.post("http://localhost:3000/roles", {
            nombre: rol.nombre,
            descripcion: rol.descripcion,
            permisos: rol.permisos.map(per => per.value),
        }).then(async data => {
            const response = await data.data;
            setLoading(false);
            if (response.errors) {
                setNotification({
                    color: 'danger',
                    text: 'Se encontraron algunos errores al crear rol.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                setModal(false)
                setNotification({
                    color: 'info',
                    text: 'Exito! Rol ingresado..',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 6000);
                setReloadData(!reloadData);
            }
        }).catch(err => {
            console.error("Error al crear rol: ", err)
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al crear rol.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 10000);
        })
    }

    const updateRol = () => {
        Axios.put("http://localhost:3000/roles", {
            id: rolEdit.id,
            nombre: rolEdit.nombre,
            descripcion: rolEdit.descripcion,
            permisos: rolEdit.permisos.map(per => per.value),
        }).then(async data => {
            const response = await data.data;
            setLoading(false);
            if (response.errors) {
                setNotification({
                    color: 'danger',
                    text: 'Se encontraron algunos errores al editar rol.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                setEditModal(false)
                setNotification({
                    color: 'info',
                    text: 'Exito! Rol editado.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 6000);
                setReloadData(!reloadData);
            }
        }).catch(err => {
            console.error("Error al editar rol: ", err)
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al editar rol.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 10000);
        })
    }

    return (
        <React.Fragment>
            <GridContainer>
                <GridItem xs={12} sm={6}>
                    <h1>Administracion de <b>Roles.</b></h1>
                </GridItem>
                <GridItem xs={12} sm={6}>
                    <div className={classes.buttonContainer}>
                        <Button color="primary" key="AddButton1" onClick={() => setModal(true)}>
                            <Add /> Agregar Rol
                        </Button>
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <AssignmentTurnedIn />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Roles registrados</h4>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={["N#", "Nombre", "Descripcion", "Permisos", "Acciones"]}
                                tableData={
                                    roles.map((rl, index) => {
                                        return [
                                            (index + 1),
                                            rl.nombre,
                                            rl.descripcion,
                                            <ul>
                                                {rl.permisos.map((per, index) => {
                                                    return <li key={index}>{per}</li>
                                                })}
                                            </ul>,
                                            fillButtons(index)
                                        ]
                                    })
                                }
                            />
                            {roles.length === 0 && <small>No existen datos ingresados.</small>}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <Dialog
                classes={{
                    root: modalClasses.center,
                    paper: modalClasses.modal,
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
                            onChange={(e) => handleRolChange("nombre", e.target.value)}
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
                            onChange={(e) => handleRolChange("descripcion", e.target.value)}
                        />
                        <br />
                        <br />
                        <Selector
                            placeholder="Permisos"
                            options={permisos.map(per => {
                                return {
                                    value: per.key,
                                    label: per.name,
                                }
                            })}
                            isMulti
                            onChange={(value) => handleRolChange("permisos", value)}
                            value={rol.permisos}
                        />
                        <br />
                        <br />
                    </form>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
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
                        onClick={createRol}>Ingresar</Button>
                    <Button onClick={() => setModal(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                classes={{
                    root: modalClasses.center,
                    paper: modalClasses.modal,
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
                    <h3 className={modalClasses.modalTitle}>Editar rol <b>{rolEditAux.nombre}</b></h3>
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
                            value={rolEdit.nombre}
                            onChange={(e) => handleEditRolChange("nombre", e.target.value)}
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
                            value={rolEdit.descripcion}
                            onChange={(e) => handleEditRolChange("descripcion", e.target.value)}
                        />
                        <br />
                        <br />
                        <Selector
                            placeholder="Permisos"
                            options={permisos.map(per => {
                                return {
                                    value: per.key,
                                    label: per.name,
                                }
                            })}
                            isMulti
                            onChange={(value) => handleEditRolChange("permisos", value)}
                            value={rolEdit.permisos}
                        />
                        <br />
                        <br />
                    </form>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
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
                        onClick={updateRol}>Actualizar</Button>
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
                    const noti = { ...notification, open: false }
                    setNotification(noti)
                }}
                close
            />
        </React.Fragment>
    )
}