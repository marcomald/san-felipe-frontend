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
import CustomTable from "components/Table/CustomTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput";
import FileUpload from 'components/CustomUpload/FileUpload1.js';
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
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
import { getUserId } from "helpers/utils";

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

export default function Sellers(props) {
    const [modal, setModal] = React.useState(false)
    const [editModal, setEditModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [modalErrors, setModalErros] = React.useState(false);
    const [modalUpload, setModalUpload] = React.useState(false)
    const [sellerEdit, setSellerEdit] = React.useState({});
    const [sellerEditAux, setSellerEditAux] = React.useState({});
    const [sellers, setSellers] = React.useState({ sellers: [], total: 0 });
    const [seller, setSeller] = React.useState({});
    const [file, setFile] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [reloadData, setReloadData] = React.useState(false)
    const [errors, setErrors] = React.useState([])
    const [notification, setNotification] = React.useState({
        color: "info",
        text: "",
        open: false,
    });
    const [sellerName, setSellerName] = React.useState("")
    const [offset, setOffset] = React.useState(0)
    const [limit, setLimit] = React.useState(10)

    const FormClasses = useStylesForm();

    useEffect(() => {
        const limite = limit ? "?limit=" + limit : ""
        Axios.get("/vendedores" + limite)
            .then(response => {
                setSellers(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props, limit])

    useEffect(() => {
        const limite = limit ? "&limit=" + limit : ""
        const offsetV = offset ? "&offset=" + offset : ""
        const nombre = sellerName !== "" ? sellerName : ""
        Axios.get("/vendedores?nombre=" + nombre + limite + offsetV)
            .then(response => {
                setSellers(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props.history, offset, limit, sellerName])

    const handleFileChange = (sellersFile) => {
        setErrors([])
        if (sellersFile.data) {
            setFile(sellersFile.data)
            return
        }
        setFile(sellersFile)
    }

    const handleSellerChange = (property, value) => {
        const newSeller = { ...seller };
        newSeller[property] = value
        setSeller(newSeller);
    };

    const handleSellerEditChange = (property, value) => {
        const newSeller = { ...sellerEdit };
        newSeller[property] = value
        setSellerEdit(newSeller);
    };

    const processFile = async () => {
        Axios.post("/vendedores/bulk", {
            vendedores: file,
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
                    text: 'Exito! Vendedores creados.',
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
            console.error("Error al subir vendedores: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al subir los vendedores.',
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


    const updateSeller = () => {
        Axios.put("/vendedores", {
            id: sellerEdit.id_vendedorid,
            nombre: sellerEdit.nombre_completo,
            estado: sellerEdit.estado,
            userId: getUserId(),
        }).then(response => {
            setEditModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Vendedor editado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al editar vendedor: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al editar el vendedor.',
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

    const createSeller = () => {
        Axios.post("/vendedores", {
            nombre: seller.nombre,
            userId: getUserId(),
        }).then(response => {
            setModal(false)
            setSeller({})
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Vendedor creado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al crear vendedor: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al crear vendedor.',
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

    const deleteClient = () => {
        Axios.delete("/vendedores/" + sellerEdit.id_vendedorid, {
            data: {
                id: sellerEdit.id_vendedorid,
                userId: getUserId(),
            },
        }).then(response => {
            setDeleteModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Vendedor eliminado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al eliminar vendedor: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al eliminar el vendedor.',
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

    const classes = useStyles();
    const modalClasses = useStylesModal();

    const fillButtons = (sellerSelected) => {
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
                        setSellerEdit({
                            ...sellerSelected,
                        })
                        setSellerEditAux({
                            ...sellerSelected,
                        })
                        prop.color === "danger" ? setDeleteModal(true) : setEditModal(true)
                    }}
                >
                    <prop.icon className={classes.icon} />
                </Button>
            );
        })
    };

    return (
        <AdminLayout>
            <GridContainer>
                <GridItem xs={12} sm={6}>
                    <h1>Vendedores</h1>
                </GridItem>
                <GridItem xs={12} sm={6}>
                    <div className={classes.buttonContainer}>
                        <Button color="primary" key="AddButton1" onClick={() => setModal(true)}>
                            <Add /> Agregar Vendedor
                        </Button>
                        <Button color="rose" key="AddButton2" onClick={() => setModalUpload(true)}>
                            <CloudUpload /> Subir Vendedores
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
                            <h4 className={classes.cardIconTitle}>Vendedores registrados</h4>
                        </CardHeader>
                        <CardBody>
                            <CustomTable
                                data={sellers.sellers.map((sl) => {
                                    return [sl.id_vendedorid, sl.nombre_completo, sl.estado.toUpperCase(), fillButtons(sl)]
                                })}
                                limite={10}
                                headers={["Codigo", "Nombre", "Estado", "Acccion"]}
                                onOffsetChange={(valueOffset) => { setOffset(valueOffset) }}
                                total={sellers.total}
                                changeLimit={(limite) => { setLimit(limite) }}
                                offset={offset}
                                onSearchChange={(name => { setSellerName(name) })}
                                searchValue={sellerName}
                                showSearch={true}
                                placeholderSearch={"Ejemplo: EDUARDO LOPEZ"}
                                labelSearch={"Nombre de vendedor a buscar"}
                            />
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
                    <h3 className={modalClasses.modalTitle}>Ingreso de nuevo vendedor</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <CustomInput
                            labelText="Nombre"
                            id="name_seller"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            value={seller.nombre}
                            onChange={(e) => handleSellerChange("nombre", e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="rose"
                        disabled={
                            !seller.nombre ||
                            seller.nombre === ""
                        }
                        onClick={createSeller}>Ingresar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Editar vendedor <b>{sellerEditAux.nombre}</b></h3>

                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <CustomInput
                            labelText="Nombre"
                            id="name_seller_edit"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            value={sellerEdit.nombre_completo}
                            onChange={(e) => handleSellerEditChange("nombre_completo", e.target.value)}
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
                                value={sellerEdit.estado ? sellerEdit.estado : ""}
                                onChange={(e) => handleSellerEditChange("estado", e.target.value)}
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
                            !sellerEdit.nombre_completo ||
                            sellerEdit.nombre_completo === ""
                        }
                        onClick={updateSeller}>Actualizar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Eliminar vendedor <b>{sellerEditAux.nombre_completo}</b></h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <h4>Esta seguro que desea <b>eliminar</b> el vendedor?</h4>
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
                    <h3 className={modalClasses.modalTitle}>Subida de archivo de vendedores</h3>
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
        </AdminLayout>
    )
}