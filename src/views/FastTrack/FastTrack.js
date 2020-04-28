import React, { useEffect } from "react";
//  Icons
import CloudUpload from "@material-ui/icons/CloudUpload";
import InfoIcon from "@material-ui/icons/Info";
import Close from "@material-ui/icons/Close";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
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
import FileUpload from 'components/CustomUpload/FileUpload1.js';
import Loader from 'components/Loader/Loader.js'
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "components/Snackbar/Snackbar.js";
import Axios from 'axios';
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import tableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import AdminLayout from "layouts/Admin";
import { getUserId } from "helpers/utils";

const customStyles = {
    ...styles,
    ...tableStyles,
    customCardContentClass: {
        paddingLeft: "0",
        paddingRight: "0"
    },
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

const useStyles = makeStyles(customStyles);
const useStylesModal = makeStyles(Modalstyles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function FastTrack(props) {

    const classes = useStyles();
    const modalClasses = useStylesModal();

    const [file, setFile] = React.useState([])
    const [errors, setErrors] = React.useState([])
    const [modal, setModal] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [notification, setNotification] = React.useState(false);
    const [reloadData, setReloadData] = React.useState(false)
    const [logCarga, setLogCarga] = React.useState({ logs: [], total: 0, })
    const [offset, setOffset] = React.useState(0)
    const [limit, setLimit] = React.useState(3)
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [fileUploadCode, setFileUploadCode] = React.useState("");

    const fillButtons = (log) => {
        const user = window.sessionStorage.getItem("user")
        const userDecode = JSON.parse(window.atob(user));
        const hasPermission = userDecode.permissions.filter(perm => perm === "eliminarregistros").length
        return [
            { color: "danger", icon: Close }
        ].map((prop, key) => {
            return (
                hasPermission > 0 && log.log_carga_estado !== 'Eliminado' && <Tooltip
                    id="tooltip-top"
                    title="Eliminar registros"
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                    key={key}
                >
                    <Button
                        color={prop.color}
                        className={classes.actionButton}
                        onClick={() => {
                            setFileUploadCode(log.log_carga_file_upload_code)
                            setDeleteModal(true)
                        }}
                    >
                        <prop.icon className={classes.icon} />
                    </Button>
                </Tooltip>
            );
        })
    };

    useEffect(() => {
        const limite = limit ? "&limit=" + limit : ""
        const offsetV = offset ? "&offset=" + offset : ""
        Axios.get("/log-carga?origen=fast%20track" + limite + offsetV)
            .then(response => {
                setLogCarga(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props.history, offset, limit])

    useEffect(() => {
        const limite = limit ? "&limit=" + limit : ""
        setOffset(0);
        Axios.get("/log-carga?origen=fast%20track" + limite)
            .then(response => {
                setLogCarga(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [limit, props.history])

    const handleFileChange = (fastTrackFile) => {
        setErrors([])
        if (fastTrackFile.data) {
            setFile(fastTrackFile.data)
            return
        }
        setFile(fastTrackFile)
    }

    const processFile = async () => {
        setLoading(true);
        await Axios.post(`/fast-tracks`, {
            fastTracks: file,
            userId: getUserId(),
        }).then(async data => {
            const response = await data.data;
            if (response.errors) {
                setErrors(response.data);
            }
            setNotification(true)
            setReloadData(!reloadData);
            setLoading(false);
        }).catch(err => {
            console.error("SE PRODUJO UN ERROR: ", err);
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            alert("Se produjo un error al procesar los datos. Intentelo de nuevo, si el problema persiste, pongase en contacto los desarrolladores");
            setLoading(false);
        })
    }

    const deleteUploadFile = () => {
        Axios.delete("/fast-tracks/" + fileUploadCode, {
            data: {
                fileUploadCode,
                userId: getUserId(),
            }
        }).then(response => {
            setDeleteModal(false)
            setReloadData(!reloadData);
            setNotification({
                color: 'info',
                text: 'Exito! Registros eliminados.',
                open: true
            })
            setTimeout(function () {
                setNotification({
                    ...notification,
                    open: false
                })
            }, 6000);
        }).catch(err => {
            console.error("Error al eliminar fasttrack de carga: ", err)
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Se produjo un error al eliminar los registros',
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
            <h1>Subida de archivos de <b>Fast Track</b>.</h1>
            <h4>A continuacion se muestra el resumen de los ulitmos 3 archivos subidos:</h4>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <AssignmentTurnedIn />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Registro de archivos subidos</h4>
                        </CardHeader>
                        <CardBody>
                            <CustomTable
                                data={logCarga.logs.map((log, index) => {
                                    return [
                                        (index + 1),
                                        new Date(log.log_carga_fecha_carga).toLocaleDateString() +
                                        ' ' +
                                        new Date(log.log_carga_fecha_carga).toLocaleTimeString(),
                                        log.usuario_nombre_completo,
                                        new Date(log.log_carga_fecha_desde).toLocaleDateString(),
                                        new Date(log.log_carga_fecha_hasta).toLocaleDateString(),
                                        log.log_carga_rows,
                                        log.log_carga_estado,
                                        fillButtons(log),
                                    ]
                                })}
                                limite={3}
                                headers={["N#", "Fecha de carga", "Usuario Responsable", "Desde", "Hasta", "Registros Procesados", 'Estado']}
                                onOffsetChange={(valueOffset) => { setOffset(valueOffset) }}
                                total={logCarga.total}
                                changeLimit={(limite) => { setLimit(limite) }}
                                offset={offset}
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} md={4}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <CloudUpload />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Carga de archivos</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <br />
                                <GridContainer>
                                    <GridItem xs={12}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <FileUpload handleFile={handleFileChange} />
                                            {file && file.length > 0 && <Button color="success" onClick={processFile}>Procesar Archivo</Button>}
                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} md={8}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <InfoIcon />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Informacion y reglas de procesamiento</h4>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <p>Los titulos de la tabla deben estar en mayusculas y deben ser los siguientes:</p>
                                <ul>
                                    <li>ICCID: Debe ser de campo numerico, con una longitud de 19 caracteres.</li>
                                    <li>FECHA: Debe ser de tipo fecha.</li>
                                    <li>PRODUCTO: Debe ser de tipo texto y debe tener como maximo 30 caracteres.</li>
                                </ul>
                            </div>
                            <hr />
                            {
                                file && file.length > 0 &&
                                <div>
                                    <h4><b>Resgistros encontrados:</b> {file && file.length}</h4>
                                    {errors && errors.length > 0 && <h4><b>Errores:</b> {errors && errors.length}</h4>}
                                    {
                                        errors && errors.length > 0 && <Button color="danger" onClick={() => setModal(true)}>Ver Errores</Button>
                                    }
                                </div>
                            }
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>

            <Dialog
                classes={{
                    root: classes.center,
                    paper: classes.modal,
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
                    <Button onClick={() => setModal(false)}>Cerrar</Button>
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
                    <h3 className={modalClasses.modalTitle}>Eliminar Fast-Tracks</h3>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={modalClasses.modalBody}
                >
                    <h4>Esta seguro que desea <b>eliminar</b> loss fast-tracks relacionados a esta carga?</h4>
                </DialogContent>
                <DialogActions
                    className={modalClasses.modalFooter + " " + modalClasses.modalFooterCenter}
                >
                    <Button
                        color="danger"
                        onClick={deleteUploadFile}
                    >
                        Eliminar
                    </Button>
                    <Button onClick={() => {
                        setDeleteModal(false)
                    }}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            {loading && <Loader show={loading} />}
            <Snackbar
                place="br"
                color={errors && errors.length > 0 ? "danger" : "info"}
                message={errors && errors.length > 0 ? "Al procesar el archivo se econtraron algunos errores, intentelo de nuevo." :
                    "Exito! no se encontraron errores en el archivo procesado."}
                open={notification}
                closeNotification={() => setNotification(false)}
                close
            />
        </AdminLayout>
    )
}