import React, { useEffect } from "react";
//  Icons
import CloudUpload from "@material-ui/icons/CloudUpload";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import InfoIcon from "@material-ui/icons/Info";
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
import FileUpload from 'components/CustomUpload/FileUpload1.js';
import Snackbar from "components/Snackbar/Snackbar.js";
import Loader from 'components/Loader/Loader.js'
import Axios from 'axios';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import FormStyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

import AdminLayout from "layouts/Admin";
import { getUserId, purchaseOrigin } from "helpers/utils";

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
const useStylesForm = makeStyles(FormStyles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function Purchase(props) {

    const [file, setFile] = React.useState([])
    const [errors, setErrors] = React.useState([])
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    const [notification, setNotification] = React.useState(false);
    const [reloadData, setReloadData] = React.useState(false)
    const [logCarga, setLogCarga] = React.useState([])
    const [origen, setOrigen] = React.useState("")

    const classes = useStyles();
    const FormClasses = useStylesForm();

    useEffect(() => {
        Axios.get("/log-carga?origen=compras")
            .then(response => {
                setLogCarga(response.data)
            }).catch(e => {
                console.error(e)
                if (e.request.status === 403) {
                    props.history.push('/login');
                    return
                }
            })
    }, [reloadData, props])

    const handleFileChange = (purchasesFile) => {
        setErrors([])
        if (purchasesFile.data) {
            setFile(purchasesFile.data)
            return
        }
        setFile(purchasesFile)
    }

    const processFile = async () => {
        setLoading(true);
        await Axios.post(`/compras`, {
            compras: file,
            userId: getUserId(),
            origen,
        }).then(async data => {
            const response = await data.data;
            if (response.errors) {
                setErrors(response.data);
            }
            setNotification(true)
            setTimeout(function () {
                setNotification(false)
            }, 10000);
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

    return (
        <AdminLayout>
            <h1>Subida de archivos de <b>Compras</b>.</h1>
            <h4>A continuacion se muestra el resumen de los ulitmos 3 archivos subidos:</h4>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <ShoppingCart />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Registro de archivos subidos</h4>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={["N#", "Fecha de carga", "Usuario Responsable", "Desde", "Hasta", "Registros Procesados"]}
                                tableData={logCarga.map((log, index) => {
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
                            />
                            {logCarga.length === 0 && <small>No existen datos ingresados.</small>}
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
                                <FormControl
                                    fullWidth
                                    className={FormClasses.selectFormControl}
                                >
                                    <InputLabel
                                        htmlFor="simple-select"
                                        className={FormClasses.selectLabel}
                                    >
                                        Origen
                            </InputLabel>
                                    <Select
                                        MenuProps={{
                                            className: FormClasses.selectMenu
                                        }}
                                        classes={{
                                            select: FormClasses.select
                                        }}
                                        value={origen}
                                        onChange={(e) => setOrigen(e.target.value)}
                                        inputProps={{
                                            name: "origenSelect",
                                            id: "origen-select"
                                        }}
                                    >
                                        <MenuItem
                                            disabled
                                            classes={{
                                                root: FormClasses.selectMenuItem
                                            }}
                                        >
                                            Eliga un origen
                                </MenuItem>
                                        {
                                            purchaseOrigin.map((ori, index) => {
                                                return (
                                                    <MenuItem
                                                        key={index}
                                                        classes={{
                                                            root: FormClasses.selectMenuItem,
                                                            selected: FormClasses.selectMenuItemSelected
                                                        }}
                                                        value={ori.value}
                                                    >
                                                        {ori.label}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <br />
                                <GridContainer>
                                    <GridItem xs={12}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <FileUpload handleFile={handleFileChange} disabled={origen === ""} />
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
                                    <li>SERIE: Debe ser de campo numerico, con una longitud de 19 caracteres.</li>
                                    <li>DN: Debe ser de campo numerico, con una longitud de 9 caracteres.</li>
                                    <li>FECHA: Debe ser de tipo fecha.</li>
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
                color={errors && errors.length > 0 ? "danger" : "info"}
                message={errors && errors.length > 0 ? "Al procesar el archivo se econtraron algunos errores, intentelo de nuevo." :
                    "Exito! el archivo se proceso correctamente."}
                open={notification}
                closeNotification={() => setNotification(false)}
                close
            />
        </AdminLayout>
    )
}