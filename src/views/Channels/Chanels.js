import React, { useEffect } from "react";
//  Icons
import Map from "@material-ui/icons/Map";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
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
import CustomInput from "components/CustomInput/CustomInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Axios from "axios";
import CreatableSelector from "components/CustomDropdown/CreatableSelector";
import Snackbar from "components/Snackbar/Snackbar.js";
import Tooltip from "@material-ui/core/Tooltip";
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
// Helper
import { channelZones, getUserId } from "helpers/utils"
import AdminLayout from "layouts/Admin";

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

export default function Channels(props) {
    const [modal, setModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [cities, setCities] = React.useState([]);
    const [channel, setChannel] = React.useState({});
    const [channelEdit, setChannelEdit] = React.useState({});
    const [channelEditAux, setChannelEditAux] = React.useState({});
    const [channels, setChannels] = React.useState({ channels: [], total: 0 });
    const [reloadData, setReloadData] = React.useState(false)
    const [notification, setNotification] = React.useState({
        color: "info",
        text: "",
        open: false,
    });
    const [offset, setOffset] = React.useState(0)
    const [limit, setLimit] = React.useState(10)

    useEffect(() => {
        const limite = limit ? "?limit=" + limit : ""
        Axios.get("/canales/ciudades")
            .then(response => {
                setCities(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })

        Axios.get("/canales" + limite)
            .then(response => {
                setChannels(response.data)
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
        Axios.get("/canales?" + limite + offsetV)
            .then(response => {
                setChannels(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props.history, offset, limit])

    const classes = useStyles();
    const modalClasses = useStylesModal();
    const FormClasses = useStylesForm();

    const fillButtons = (ch) => {
        return [
            { color: "success", icon: Edit },
            { color: "danger", icon: Close }
        ].map((prop, key) => {
            return (
                <Tooltip
                    id="tooltip-top"
                    title={prop.color === "danger" ? "Eliminar canal" : "Editar canal"}
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                    key={key}
                >
                    <Button
                        color={prop.color}
                        className={classes.actionButton}
                        key={key}
                        onClick={() => {
                            setChannelEdit({
                                ...ch,
                                ciudad: {
                                    value: ch.ciudad,
                                    label: ch.ciudad,
                                }
                            })
                            setChannelEditAux({
                                ...ch,
                                ciudad: {
                                    value: ch.ciudad,
                                    label: ch.ciudad,
                                }
                            })
                            prop.color === "danger" ? setDeleteModal(true) : setEditModal(true)
                        }}
                    >
                        <prop.icon className={classes.icon} />
                    </Button>
                </Tooltip>
            );
        })
    };

    const handleChannelChange = (property, value) => {
        const newChannel = { ...channel };
        newChannel[property] = value
        setChannel(newChannel);
    };

    const handleChannelEditChange = (property, value) => {
        const newChannel = { ...channelEdit };
        newChannel[property] = value
        setChannelEdit(newChannel);
    };

    const validateCreateChannel = () => {
        const aux = channels.filter(ch => ch.zonificacion === channel.zone &&
            ch.nombre === channel.nombre &&
            ch.ciudad === (channel.ciudad && channel.ciudad.value)).length
        if (aux === 0) {
            createChannel()
        } else {
            setNotification({
                color: 'danger',
                text: 'Error! ya existe un canal con ese nombre, en esa ciudad y en la misma zona.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 10000);
        }
    }

    const validateEditChannel = () => {
        if (channelEdit.nombre !== channelEditAux.nombre) {
            const aux = channels.channels.filter(ch => ch.zonificacion === channelEdit.zonificacion &&
                ch.nombre === channelEdit.nombre &&
                ch.ciudad === (channelEdit.ciudad && channelEdit.ciudad.value)).length
            if (aux === 0) {
                editChannel()
            } else {
                setNotification({
                    color: 'danger',
                    text: 'Error! ya existe un canal con ese nombre, en esa ciudad y en la misma zona.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            }
        } else {
            editChannel()
        }
    }

    const deleteChannel = () => {
        Axios.delete("/canales/" + channelEdit.id_canal, {
            data: {
                id: channelEdit.id_canal,
                userId: getUserId(),
            },
        }).then(response => {
            setDeleteModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Canal eliminado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al eliminar canal: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al eliminar el canal.',
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

    const editChannel = () => {
        Axios.put("/canales", {
            id: channelEdit.id_canal,
            nombre: channelEdit.nombre,
            zonificacion: channelEdit.zonificacion,
            ciudad: channelEdit.ciudad.value,
            estado: channelEdit.estado,
            userId: getUserId(),
        }).then(response => {
            setEditModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Canal editado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al editar canal: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al editar el canal.',
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

    const createChannel = () => {
        Axios.post("/canales", {
            nombre: channel.nombre,
            zonificacion: channel.zone,
            ciudad: channel.ciudad.value,
            userId: getUserId(),
        }).then(response => {
            const channelsList = channels
            channelsList.push(response.data)
            setChannels(channelsList)
            setModal(false)
            setReloadData(!reloadData);
            setChannel({})
            setNotification({
                color: 'info',
                text: 'Exito! Canal creado.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al crear canal: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al crear el canal.',
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
        <AdminLayout>
            <GridContainer>
                <GridItem xs={12} sm={6}>
                    <h1>Canales por ciudad</h1>
                </GridItem>
                <GridItem xs={12} sm={6}>
                    <div className={classes.buttonContainer}>
                        <Button color="primary" key="AddButton" onClick={() => setModal(true)}>
                            <Add /> Agregar Canal
                        </Button>
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                                <Map />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Canales por ciudad existentes</h4>
                        </CardHeader>
                        <CardBody>
                            <CustomTable
                                data={channels.channels.map((ch, index) => {
                                    return [ch.nombre, ch.ciudad, ch.zonificacion, fillButtons(ch)]
                                })}
                                limite={10}
                                headers={["Nombre", "Ciudad", "Zona", "Accion"]}
                                onOffsetChange={(valueOffset) => { setOffset(valueOffset) }}
                                total={channels.total}
                                changeLimit={(limite) => { setLimit(limite) }}
                                offset={offset}
                                showSearch={false}
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
                    <h3 className={modalClasses.modalTitle}>Ingreso de nuevo canal</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <CustomInput
                            labelText="Nombre de canal"
                            id="name_channel"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            onChange={(e) => handleChannelChange("nombre", e.target.value)}
                            value={channel.nombre}
                        />
                        <br></br>
                        <CreatableSelector
                            options={cities.map(city => {
                                return {
                                    value: city.ciudad,
                                    label: city.ciudad,
                                }
                            })}
                            onChange={
                                (value) => handleChannelChange("ciudad", value)
                            }
                            placeholder="Seleccione una ciudad"
                            value={channel.ciudad}
                        />

                        <FormControl
                            fullWidth
                            className={FormClasses.selectFormControl}
                        >
                            <InputLabel
                                htmlFor="simple-select"
                                className={FormClasses.selectLabel}
                            >
                                Zona
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: FormClasses.selectMenu
                                }}
                                classes={{
                                    select: FormClasses.select
                                }}
                                value={channel.zone ? channel.zone : ""}
                                onChange={(e) => handleChannelChange("zone", e.target.value)}
                                inputProps={{
                                    name: "zoneSelect",
                                    id: "zone-select"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: FormClasses.selectMenuItem
                                    }}
                                >
                                    Eliga una zona
                                </MenuItem>
                                {
                                    channelZones.map((zone, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                classes={{
                                                    root: FormClasses.selectMenuItem,
                                                    selected: FormClasses.selectMenuItemSelected
                                                }}
                                                value={zone.value}
                                            >
                                                {zone.label}
                                            </MenuItem>
                                        )
                                    })
                                }
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
                            !channel.nombre ||
                            channel.nombre === "" ||
                            !channel.zone ||
                            channel.zone === "" ||
                            !channel.ciudad ||
                            !channel.ciudad.value ||
                            channel.ciudad.value === ""
                        }
                        onClick={validateCreateChannel}
                    >
                        Ingresar
                    </Button>
                    <Button onClick={() => {
                        setChannel({})
                        setModal(false)
                    }}>Cancelar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Editar canal <b>{channelEditAux.nombre}</b></h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <form>
                        <CustomInput
                            labelText="Nombre de canal"
                            id="name_channel_edit"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
                            value={channelEdit.nombre}
                            onChange={(e) => handleChannelEditChange("nombre", e.target.value)}
                        />
                        <br></br>
                        <br></br>
                        <CreatableSelector
                            options={cities.map(city => {
                                return {
                                    value: city.ciudad,
                                    label: city.ciudad,
                                }
                            })}
                            onChange={
                                (value) => handleChannelEditChange("ciudad", value)
                            }
                            placeholder="Seleccione una ciudad"
                            value={channelEdit.ciudad}
                        />
                        <br></br>
                        <FormControl
                            fullWidth
                            className={FormClasses.selectFormControl}
                        >
                            <InputLabel
                                htmlFor="zone-select-edit"
                                className={FormClasses.selectLabel}
                            >
                                Zona
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: FormClasses.selectMenu
                                }}
                                classes={{
                                    select: FormClasses.select
                                }}
                                value={channelEdit.zonificacion ? channelEdit.zonificacion : ""}
                                onChange={(e) => handleChannelEditChange("zonificacion", e.target.value)}
                                inputProps={{
                                    name: "zoneSelectEdit",
                                    id: "zone-select-edit"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: FormClasses.selectMenuItem
                                    }}
                                >
                                    Eliga una zona
                                </MenuItem>
                                {
                                    channelZones.map((zone, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                classes={{
                                                    root: FormClasses.selectMenuItem,
                                                    selected: FormClasses.selectMenuItemSelected
                                                }}
                                                value={zone.value}
                                            >
                                                {zone.label}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>

                        </FormControl>
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
                                value={channelEdit.estado ? channelEdit.estado : ""}
                                onChange={(e) => handleChannelEditChange("estado", e.target.value)}
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
                            !channelEdit.nombre ||
                            channelEdit.nombre === "" ||
                            !channelEdit.zonificacion ||
                            channelEdit.zonificacion === "" ||
                            !channelEdit.ciudad ||
                            !channelEdit.ciudad.value ||
                            channelEdit.ciudad.value === ""
                        }
                        onClick={validateEditChannel}
                    >
                        Actualizar
                    </Button>
                    <Button onClick={() => {
                        setEditModal(false)
                    }}>Cancelar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Eliminar canal <b>{channelEditAux.nombre}</b></h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <h4>Esta seguro que desea <b>eliminar</b> el canal?</h4>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="danger"
                        onClick={deleteChannel}
                    >
                        Eliminar
                    </Button>
                    <Button onClick={() => {
                        setDeleteModal(false)
                    }}>Cancelar</Button>
                </DialogActions>
            </Dialog>

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