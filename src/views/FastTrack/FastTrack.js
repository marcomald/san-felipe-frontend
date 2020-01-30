import React from "react";
//  Icons
import CloudUpload from "@material-ui/icons/CloudUpload";
import InfoIcon from "@material-ui/icons/Info";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
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
import Loader from 'components/Loader/Loader.js'
import Snackbar from "components/Snackbar/Snackbar.js";
// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
// Validations
import { validateLength, validateRepited, validateIntField, validateLessLength } from 'helpers/validations.js'
import axios from 'axios';

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

export default function FastTrack() {
    const classes = useStyles();
    const [file, setFile] = React.useState([])
    const [processedFile, setProcessedFile] = React.useState([])
    const [errors, setErrors] = React.useState([])
    const [modal, setModal] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [notification, setNotification] = React.useState(false);

    // useEffect(()=>{
    //     axios.get(`https://jsonplaceholder.typicode.com/users`)
    //     .then(res => {
    //       const persons = res.data;
    //       console.log("---------------->");
    //       console.log(persons);

    //     })
    // })

    const insertFastTracks = async () => {
        console.log("ENTRO");
        const response = await axios.post(`http://localhost:3000/fast-tracks`, {
            fastTracks: processedFile
        })
        console.log("RESPONSE", response.data);
    }

    const handleFileChange = async (fastTrackFile) => {
        await setFile(fastTrackFile.data)
    }

    const processFile = () => {
        setLoading(true)
        const processArray = []
        const errorsArray = []
        file.forEach((ft, i) => {

            const index = i + 2
            if (!validateLength(ft.ICCID, 19)) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICCID' no posee 19 caracteres.`, row: JSON.stringify(ft) })
            }

            if (!validateIntField(ft.ICCID)) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICCID' no es de tipo numerico.`, row: JSON.stringify(ft) })
            }

            if (!validateLessLength(ft.PRODUCTO, 30)) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'PRODUCTO' posee mas de 30 caracteres.`, row: JSON.stringify(ft) })
            }

            const iccidRepited = validateRepited(processArray, "ICCID", ft.ICCID)
            if (iccidRepited) {
                errorsArray.push({ error: `Error en la linea ${index}, el campo 'ICCID'  se encuentra repetido.`, row: JSON.stringify(ft) })
            }
            processArray.push(ft)
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


    return (
        <React.Fragment>
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
                            <Table
                                tableHeaderColor="primary"
                                tableHead={["N#", "Fecha de carga", "Usuario Responsable", "Desde", "Hasta", "Registros Procesados"]}
                                tableData={[
                                    ["1", "14/01/2020", "Marco Lozano", "20/12/2019", "10/01/2020", "420"],
                                    ["2", "14/02/2020", "Diego Perez", "11/01/2020", "10/02/2020", "350"],
                                    ["3", "14/03/2020", "Estafania Obando", "11/02/2020", "10/03/2020", "380"],
                                ]}
                                coloredColls={[3]}
                                colorsColls={["primary"]}
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
                                {/* <Button color="success">Submit</Button> */}
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
                                errors && errors.length > 0 && <Button color="success" onClick={() => setModal(true)}>Ver Errores</Button>
                            }
                            {
                                processedFile && processedFile.length > 0 &&
                                errors && errors.length === 0 &&
                                <Button color="success" onClick={insertFastTracks}>Guardar datos Procesados</Button>
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
                                <div>
                                    <h4><b>{index + 1}. </b>{error.error}</h4>
                                    <h5>{error.row}</h5>
                                </div>
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