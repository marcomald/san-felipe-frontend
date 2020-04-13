import React, { useEffect } from "react";
//  Icons
import CloudUpload from "@material-ui/icons/CloudUpload";
import AttachMoney from "@material-ui/icons/AttachMoney";
import InfoIcon from "@material-ui/icons/Info";
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
import Selector from "components/CustomDropdown/CustomSelector";
import Axios from 'axios';
import Snackbar from "components/Snackbar/Snackbar.js";
import Loader from 'components/Loader/Loader.js'
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// Styles
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
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
    }
};

const useStyles = makeStyles(customStyles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function Purchase(props) {
    const [file, setFile] = React.useState([]);
    const [errors, setErrors] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [canales, setCanales] = React.useState({ channels: [], total: 0 });
    const [venta, setVenta] = React.useState({});
    const [reloadData, setReloadData] = React.useState(false);
    const [notification, setNotification] = React.useState({
        color: "info",
        text: "",
        open: false,
    });
    const [logCarga, setLogCarga] = React.useState({ logs: [], total: 0, })
    const [offset, setOffset] = React.useState(0)
    const [limit, setLimit] = React.useState(3)
    const classes = useStyles();

    useEffect(() => {
        Axios.get("/log-carga?origen=ventas")
            .then(response => {
                setLogCarga(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })

        Axios.get("/canales")
            .then(response => {
                setCanales(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })

    }, [reloadData, props])

    useEffect(() => {
        const limite = limit ? "&limit=" + limit : ""
        const offsetV = offset ? "&offset=" + offset : ""
        Axios.get("/log-carga?origen=ventas" + limite + offsetV)
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
        Axios.get("/log-carga?origen=ventas" + limite)
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

    const handleSearchCanal = (nombreCanal) => {
        Axios.get("/canales?nombre=" + nombreCanal)
            .then(response => {
                setCanales(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }

    const handleVentasChange = (property, value) => {
        const newVenta = { ...venta };
        newVenta[property] = value
        setVenta(newVenta);
    };


    const handleFileChange = (salesFile) => {
        setErrors([])
        if (salesFile.data) {
            setFile(salesFile.data)
            return
        }
        setFile(salesFile)
    }

    const processFile = async () => {
        setLoading(true);
        const zona = canales.channels.filter(ch => ch.id_canal === venta.canal.value)[0]
        await Axios.post(`/despachos`, {
            ventas: file,
            id_canal: venta.canal.value,
            zona: zona.zonificacion,
            userId: getUserId(),
        }).then(async data => {
            const response = await data.data;
            setLoading(false);
            if (response.errors) {
                setErrors(response.data);
                setNotification({
                    color: 'danger',
                    text: 'Error! Se encontraron algunos errores al subir el archivo de ventas.',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            } else {
                setReloadData(!reloadData);
                setNotification({
                    color: 'info',
                    text: 'Exito! Ventas ingresadas',
                    open: true
                })
                setTimeout(function () {
                    setNotification({
                        ...notification,
                        open: false
                    })
                }, 10000);
            }

        }).catch(err => {
            setLoading(false);
            console.error("Error al subir el archivo de ventas: ", err);
            if (err.request.status === 403) {
                props.history.push('/login');
                return
            }
            setNotification({
                color: 'danger',
                text: 'Error! Se produjo un error al subir las ventas.',
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
            <h1>Subida de archivos de <b>Ventas</b>.</h1>
            <h4>A continuacion se muestra el resumen de los ulitmos 3 archivos subidos:</h4>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                                <AttachMoney />
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
                                    ]
                                })}
                                limite={3}
                                headers={["N#", "Fecha de carga", "Usuario Responsable", "Desde", "Hasta", "Registros Procesados"]}
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
                <GridItem xs={12} md={6}>
                    <Card>
                        <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                                <CloudUpload />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Carga de archivos</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <br />
                                <Selector
                                    placeholder="Canales"
                                    options={canales.channels.map(canal => {
                                        return {
                                            value: canal.id_canal,
                                            label: canal.nombre + " - " + canal.ciudad + " - " + canal.zonificacion,
                                        }
                                    })}
                                    onInputChange={(value) => handleSearchCanal(value)}
                                    onChange={(value) => handleVentasChange("canal", value)}
                                    value={venta.canal}
                                />
                                <br />
                                <GridContainer>
                                    <GridItem xs={12}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <FileUpload
                                                disabled={
                                                    !venta.canal ||
                                                    !venta.canal.value ||
                                                    venta.canal.value === ""
                                                }
                                                handleFile={handleFileChange}
                                            />
                                            {file && file.length > 0 && <Button color="rose" onClick={processFile}>Procesar Archivo</Button>}
                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} md={6}>
                    <Card>
                        <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                                <InfoIcon />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Informacion de procesamiento</h4>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <p>Los titulos de la tabla deben estar en mayusculas y deben ser los siguientes:</p>
                                <ul>
                                    <li>ICC: Debe ser de campo numerico, con una longitud de 19 caracteres.</li>
                                    <li>DN: Debe ser de campo numerico, con una longitud de 9 caracteres.</li>
                                    <li>FECHA: Debe ser de tipo fecha.</li>
                                    <li>VENDEDOR: Debe ser de tipo numerico, y debe coincidir con el ya registrado.</li>
                                    <li>IDENTIFICACION: Debe tener una longitud de hasta 13 caracteres.
                                    Debe coincidir con el numero de identificacion registrado en clientes.
                                        Este campo es opcional solo si el canal seleccionado tiene una zona distinta de "S".</li>
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