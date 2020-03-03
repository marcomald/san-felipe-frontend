import React, { useEffect } from "react";
//  Icons
import Group from "@material-ui/icons/Group";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import CloudUpload from "@material-ui/icons/CloudUpload";
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
import CustomInput from "components/CustomInput/CustomInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FileUpload from 'components/CustomUpload/FileUpload1.js';
import Loader from 'components/Loader/Loader.js'
import Axios from 'axios';
import Snackbar from "components/Snackbar/Snackbar.js";
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// Styles
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import FormStyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import AdminLayout from "layouts/Admin";
import { getUserId } from "helpers/utils"

// Helper
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
const useStylesForm = makeStyles(FormStyles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function Clients(props) {
    const [modal, setModal] = React.useState(false)
    const [editModal, setEditModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [modalErrors, setModalErros] = React.useState(false);
    const [modalUpload, setModalUpload] = React.useState(false)
    const [clients, setClients] = React.useState([]);
    const [client, setClient] = React.useState({});
    const [clientEdit, setClientEdit] = React.useState({});
    const [clientEditAux, setClientEditAux] = React.useState({});
    const [file, setFile] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [reloadData, setReloadData] = React.useState(false)
    const [errors, setErrors] = React.useState([])
    const [notification, setNotification] = React.useState({
        color: "info",
        text: "",
        open: false,
    });

    useEffect(() => {
        Axios.get("/clientes")
            .then(response => {
                setClients(response.data)
            }).catch(e => {
                console.error(e);
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props])

    const handleFileChange = (clientsFile) => {
        setErrors([])
        if (clientsFile.data) {
            setFile(clientsFile.data)
            return
        }
        setFile(clientsFile)
    }

    const classes = useStyles();
    const modalClasses = useStylesModal();
    const FormClasses = useStylesForm();

    const fillButtons = (indexClient) => {
        return [
            { color: "success", icon: Edit },
            { color: "danger", icon: Close }
        ].map((prop, key) => {
            return (
                <Button
                    color={prop.color}
                    className={classes.actionButton}
                    key={key}
                    onClick={() => {
                        setClientEdit({
                            ...clients[indexClient],
                            tipoIdentificacion: clients[indexClient].identificacion.length === 13 ? 'RUC' : 'CI'
                        })
                        setClientEditAux({
                            ...clients[indexClient],
                            tipoIdentificacion: clients[indexClient].identificacion.length === 13 ? 'RUC' : 'CI'
                        })
                        prop.color === "danger" ? setDeleteModal(true) : setEditModal(true)
                    }}
                >
                    <prop.icon className={classes.icon} />
                </Button>
            );
        })
    };

    const handleClientChange = (property, value) => {
        const newClient = { ...client };
        newClient[property] = value
        setClient(newClient);
    };

    const handleClientEditChange = (property, value) => {
        const newClient = { ...clientEdit };
        newClient[property] = value
        setClientEdit(newClient);
    };

    const deleteClient = () => {
        Axios.delete("/clientes/" + clientEdit.id_cliente, {
            data: {
                id: clientEdit.id_cliente,
                userId: getUserId(),
            }
        }).then(response => {
            setDeleteModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Cliente eliminado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al eliminar cliente: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al eliminar el cliente.',
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

    const editClient = () => {
        Axios.put("/clientes", {
            id: clientEdit.id_cliente,
            nombre: clientEdit.nombre_completo,
            identificacion: clientEdit.identificacion,
            estado: clientEdit.estado,
            userId: getUserId(),
        }).then(response => {
            setEditModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Cliente editado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al editar cliente: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al editar el cliente.',
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

    const createClient = () => {
        Axios.post("/clientes", {
            nombre: client.nombre,
            identificacion: client.identificacion,
            userId: getUserId(),
        }).then(response => {
            const clientsList = clients
            clientsList.push(response.data)
            setClients(clientsList)
            setClient({})
            setModal(false)
            setNotification({
                color: 'info',
                text: 'Exito! Cliente creado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(e => {
            console.error(e)
            if (e.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al crear cliente.',
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

    const processFile = async () => {
        Axios.post("/clientes/bulk", {
            clientes: file,
            userId: getUserId(),
        }).then(async data => {
            const response = await data.data;
            setLoading(false);
            if (response.errors) {
                setErrors(response.data);
                setNotification({
                    color: 'danger',
                    text: 'Se encontraron algunos errores al subir los clientes.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                setModalUpload(false)
                setNotification({
                    color: 'info',
                    text: 'Exito! Clientes creados.',
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
            console.error("Error al subir clientes: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al subir los clientes.',
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

    const validateForm = () => {
        let errorMessage = ""
        if (client.tipoIdentificacion === "RUC" && client.identificacion.length !== 13) {
            errorMessage = "El numero de identificacion no tiene 13 carcteres. ";
        }
        if (client.tipoIdentificacion === "CI" && client.identificacion.length !== 10) {
            errorMessage = "El numero de identificacion no tiene 10 carcteres. ";
        }
        if (clients.filter(cl => cl.identificacion === client.identificacion).length > 0) {
            errorMessage = errorMessage + "Ya existe un cliente con ese numero de identificacion";
        }

        if (errorMessage.length > 0) {
            setNotification({
                color: 'danger',
                text: errorMessage,
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 10000);
        } else {
            createClient()
        }
    }

    const validateEditForm = () => {
        if (clientEdit.identificacion !== clientEditAux.identificacion) {
            let errorMessage = ""
            if (clientEdit.tipoIdentificacion === "RUC" && clientEdit.identificacion.length !== 13) {
                errorMessage = "El numero de identificacion no tiene 13 carcteres. ";
            }
            if (clientEdit.tipoIdentificacion === "CI" && clientEdit.identificacion.length !== 10) {
                errorMessage = "El numero de identificacion no tiene 10 carcteres. ";
            }
            if (clients.filter(cl => cl.identificacion === clientEdit.identificacion).length > 0) {
                errorMessage = errorMessage + "Ya existe un cliente con ese numero de identificacion";
            }

            if (errorMessage.length > 0) {
                setNotification({
                    color: 'danger',
                    text: errorMessage,
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                editClient()
            }
        } else {
            let errorMessage = ""
            if (clientEdit.tipoIdentificacion === "RUC" && clientEdit.identificacion.length !== 13) {
                errorMessage = "El numero de identificacion no tiene 13 carcteres. ";
            }
            if (clientEdit.tipoIdentificacion === "CI" && clientEdit.identificacion.length !== 10) {
                errorMessage = "El numero de identificacion no tiene 10 carcteres. ";
            }

            if (errorMessage.length > 0) {
                setNotification({
                    color: 'danger',
                    text: errorMessage,
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                editClient()
            }
        }

    }

    return (
        <AdminLayout>
            <GridContainer>
                <GridItem xs={12} sm={6}>
                    <h1>Clientes</h1>
                </GridItem>
                <GridItem xs={12} sm={6}>
                    <div className={classes.buttonContainer}>
                        <Button color="primary" key="AddButton1" id="addClientBtn" onClick={() => setModal(true)}>
                            <Add /> Agregar Cliente
                        </Button>
                        <Button color="rose" key="AddButton2" id="uploadClientBtn" onClick={() => setModalUpload(true)}>
                            <CloudUpload /> Subir Clientes
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
                            <h4 className={classes.cardIconTitle}>Clientes registrados</h4>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={["N", "RUC/CI", "Nombre", "Estado", "Acccion"]}
                                tableData={clients.map((cl, index) => {
                                    return [index + 1, cl.identificacion, cl.nombre_completo, cl.estado.toUpperCase(), fillButtons(index)]
                                })}
                            />
                            {clients.length === 0 && <small>No existen datos ingresados.</small>}
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
                    <h3 className={modalClasses.modalTitle}>Ingreso de nuevo cliente</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <FormControl
                            fullWidth
                            className={FormClasses.selectFormControl}
                        >
                            <InputLabel
                                htmlFor="identification-type-select"
                                className={FormClasses.selectLabel}
                            >
                                Tipo de identificacion
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: FormClasses.selectMenu
                                }}
                                classes={{
                                    select: FormClasses.select
                                }}
                                value={client.tipoIdentificacion || ""}
                                onChange={(e) => handleClientChange("tipoIdentificacion", e.target.value)}
                                inputProps={{
                                    name: "identificationTypeSelect",
                                    id: "identification-type-select"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: FormClasses.selectMenuItem
                                    }}
                                >
                                    Eliga un tipo de identificacion
                                </MenuItem>
                                <MenuItem
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="RUC"
                                >
                                    RUC
                                </MenuItem>
                                <MenuItem
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="CI"
                                >
                                    Cedula de identidad
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <CustomInput
                            labelText="Numero de identificacion"
                            id="identification_number_client"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "number"
                            }}
                            value={client.identificacion}
                            onChange={(e) => handleClientChange("identificacion", e.target.value)}
                        />
                        <CustomInput
                            labelText="Nombre"
                            id="name_client"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            onChange={(e) => handleClientChange("nombre", e.target.value)}
                            value={client.nombre}
                        />
                    </form>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="rose"
                        disabled={
                            !client.nombre ||
                            client.nombre === "" ||
                            !client.identificacion ||
                            client.identificacion === "" ||
                            !client.tipoIdentificacion ||
                            !client.tipoIdentificacion === ""
                        }
                        onClick={validateForm}
                    >Ingresar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Editar cliente <b>{clientEditAux.nombre_completo}</b></h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <FormControl
                            fullWidth
                            className={FormClasses.selectFormControl}
                        >
                            <InputLabel
                                htmlFor="identification-type-select-edit"
                                className={FormClasses.selectLabel}
                            >
                                Tipo de identificacion
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: FormClasses.selectMenu
                                }}
                                classes={{
                                    select: FormClasses.select
                                }}
                                value={clientEdit.tipoIdentificacion || ""}
                                onChange={(e) => handleClientEditChange("tipoIdentificacion", e.target.value)}
                                inputProps={{
                                    name: "identificationTypeSelectEdit",
                                    id: "identification-type-select-edit"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: FormClasses.selectMenuItem
                                    }}
                                >
                                    Eliga un tipo de identificacion
                                </MenuItem>
                                <MenuItem
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="RUC"
                                >
                                    RUC
                                </MenuItem>
                                <MenuItem
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="CI"
                                >
                                    Cedula de identidad
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <CustomInput
                            labelText="Numero de identificacion"
                            id="identification_number_client_edit"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "number"
                            }}
                            value={clientEdit.identificacion}
                            onChange={(e) => handleClientEditChange("identificacion", e.target.value)}
                        />
                        <CustomInput
                            labelText="Nombre"
                            id="name_client_edit"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            onChange={(e) => handleClientEditChange("nombre_completo", e.target.value)}
                            value={clientEdit.nombre_completo}
                        />
                        <FormControl
                            fullWidth
                            className={FormClasses.selectFormControl}
                        >
                            <InputLabel
                                htmlFor="state-select-edit"
                                className={FormClasses.selectLabel}
                            >
                                Estado
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: FormClasses.selectMenu
                                }}
                                classes={{
                                    select: FormClasses.select
                                }}
                                value={clientEdit.estado ? clientEdit.estado : ""}
                                onChange={(e) => handleClientEditChange("estado", e.target.value)}
                                inputProps={{
                                    name: "stateSelectEdit",
                                    id: "state-select-edit"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: FormClasses.selectMenuItem
                                    }}
                                >
                                    Eliga un estado
                                </MenuItem>
                                <MenuItem
                                    key={"active"}
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="activo"
                                >
                                    Activo
                                </MenuItem>
                                <MenuItem
                                    key={"inactive"}
                                    classes={{
                                        root: FormClasses.selectMenuItem,
                                        selected: FormClasses.selectMenuItemSelected
                                    }}
                                    value="inactivo"
                                >
                                    Inactivo
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="rose"
                        disabled={
                            !clientEdit.nombre_completo ||
                            clientEdit.nombre_completo === "" ||
                            !clientEdit.identificacion ||
                            clientEdit.identificacion === "" ||
                            !clientEdit.tipoIdentificacion ||
                            !clientEdit.tipoIdentificacion === ""
                        }
                        onClick={validateEditForm}
                    >Actualizar</Button>
                    <Button onClick={() => setEditModal(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                classes={{
                    root: modalClasses.center,
                    paper: modalClasses.modal,
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
                    <h3 className={modalClasses.modalTitle}>Eliminar cliente <b>{clientEditAux.nombre_completo}</b></h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <h4>Esta seguro que desea <b>eliminar</b> el cliente?</h4>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="danger"
                        onClick={deleteClient}
                    >
                        Eliminar
                    </Button>
                    <Button onClick={() => {
                        setDeleteModal(false)
                    }}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                classes={{
                    root: modalClasses.center,
                    paper: modalClasses.modal,
                }}
                open={modalUpload}
                transition={Transition}
                keepMounted
                onClose={() => setModalUpload(false)}
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
                    <h3 className={modalClasses.modalTitle}>Subida de archivo de clientes</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <div style={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
                        <FileUpload handleFile={handleFileChange} />
                        <ul>
                            {file && file.length > 0 && <li><h4><b>Resgistros encontrados:</b> {file && file.length}</h4></li>}
                            {errors && errors.length > 0 && <li><h4><b>Errores:</b> {errors && errors.length}</h4></li>}
                        </ul>
                        {
                            errors && errors.length > 0 && <Button color="danger" onClick={() => setModalErros(true)}>Ver Errores</Button>
                        }
                    </div>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    {file && file.length > 0 && <Button color="success" onClick={processFile}>Procesar Archivo</Button>}
                    <Button onClick={() => setModalUpload(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                classes={{
                    root: classes.center,
                    paper: classes.modal,
                }}
                open={modalErrors}
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
                    className={classes.modalHeader}
                >
                    <h3 className={classes.modalTitle}>Errores encontrados</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={classes.modalBody}
                >
                    {errors && errors.map((error, index) => {
                        return (
                            <div key={index}>
                                <h4><b>{index + 1}. </b>{error.error}</h4>
                                <h5>{error.row}</h5>
                            </div>
                        )
                    })}
                </DialogContent>
                <DialogActions
                    className={classes.modalFooter + " " + classes.modalFooterCenter}
                >
                    <Button onClick={() => setModalErros(false)}>Cerrar</Button>
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
        </AdminLayout >
    )
}