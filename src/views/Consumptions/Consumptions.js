import React from "react";
//  Icons
import CloudUpload from "@material-ui/icons/CloudUpload";
import InfoIcon from "@material-ui/icons/Info";
import SpeakerPhone from "@material-ui/icons/SpeakerPhone";

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

// import Loader from '../Components/Loader'
import Loader from 'components/Loader/Loader.js'

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

// Validations
import { validateLength, validateRepited, validateIntField } from 'helpers/validations.js'

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

export default function Consumptions() {
    const classes = useStyles();
    const [file, setFile] = React.useState([])
    const [processedFile, setProcessedFile] = React.useState([])
    const [errors, setErrors] = React.useState([])
    const [modal, setModal] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [notification, setNotification] = React.useState(false);

    const handleFileChange = async (purchasesFile) => {
        await setFile(purchasesFile.data)
    }

    const validateFile = () => {
        setLoading(true)
        const processArray = []
        const errorsArray = []
        file.forEach((consumption, i) => {
            const index = i + 2
            if (!validateLength(consumption.ICC, 19)) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICC' no posee 19 caracteres.`, row: JSON.stringify(consumption) })
            }
            if (!validateIntField(consumption.ICC)) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICC' no es de tipo numerico.`, row: JSON.stringify(consumption) })
            }

            if (consumption.hasOwnProperty("COMISION1") && !consumption.hasOwnProperty("FECHA1")) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'FECHA1' no puede estar vacio.`, row: JSON.stringify(consumption) })
            }
            if (!consumption.hasOwnProperty("COMISION1") && consumption.hasOwnProperty("FECHA1")) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'COMISION1' no puede estar vacio.`, row: JSON.stringify(consumption) })
            }

            if (consumption.hasOwnProperty("COMISION2") && !consumption.hasOwnProperty("FECHA2")) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'FECHA2' no puede estar vacio.`, row: JSON.stringify(consumption) })
            }
            if (!consumption.hasOwnProperty("COMISION2") && consumption.hasOwnProperty("FECHA2")) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'COMISION2' no puede estar vacio.`, row: JSON.stringify(consumption) })
            }

            const iccidRepited = validateRepited(file, "ICC", consumption.ICC)
            if (iccidRepited) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICC' se encuentra repetido.`, row: JSON.stringify(consumption) })
            }
            processArray.push(consumption)
        })
        setProcessedFile(processArray)
        setErrors(errorsArray)
        setLoading(false)

        if (errorsArray.length > 0) {
            setNotification(true)
            setTimeout(function () {
                setNotification(false)
            }, 6000);
        } else {
            setNotification(true)
            setTimeout(function () {
                setNotification(false)
            }, 6000);
        }
    }

    const processFile = async () => {
        setLoading(true)
        setTimeout(() => {
            validateFile()
            setLoading(false)
        }, 100);
    }

    return (
        <React.Fragment>
            <h1>Subida de archivos de <b>Consumos</b>.</h1>
            <h4>A continuacion se muestra el resumen de los ulitmos 3 archivos subidos:</h4>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <SpeakerPhone />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Registro de archivos subidos</h4>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={["N#", "Fecha de carga", "Usuario Responsable", "Desde", "Hasta", "Registros Procesados"]}
                                tableData={[
                                    ["1", "14/01/2020", "Marco Lozano", "20/12/2019", "10/01/2020", "420"],
                                    ["2", "14/02/2020", "Diego Perez", "11/01/2020", "10/02/2020", "350"],
                                    ["3", "14/03/2020", "Estafania Obando", "11/02/2020", "10/03/2020", "380"],
                                ]}
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
                            <h4 className={classes.cardIconTitle}>Informacion de procesamiento</h4>
                        </CardHeader>
                        <CardBody>
                            <ul>
                                <li><h4><b>Resgistros encontrados:</b> {processedFile && processedFile.length}</h4></li>
                                <li><h4><b>Errores:</b> {errors && errors.length}</h4></li>
                            </ul>
                            {
                                errors && errors.length > 0 && <Button color="danger" onClick={() => setModal(true)}>Ver Errores</Button>
                            }
                            {
                                processedFile && processedFile.length > 0 &&
                                errors && errors.length === 0 &&
                                <Button color="success">Guardar datos Procesados</Button>
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
                    <ul>
                        {errors && errors.map((error, index) => {
                            return (
                                <li key={index}>
                                    <div>
                                        <h4><b>{index + 1}. </b>{error.error}</h4>
                                        <h5>{error.row}</h5>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
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
                    "Exito! no se encontraron errores en el archivo procesado."}
                open={notification}
                closeNotification={() => setNotification(true)}
                close
            />
        </React.Fragment>
    )
}