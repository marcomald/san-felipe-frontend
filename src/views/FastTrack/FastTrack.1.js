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
import FileUpload from 'components/CustomUpload/FileUpload.js';

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

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
    const [modal, setModal] = React.useState(false);

    const handleFileChange = (purchasesRowsFile) => {
        setFile(purchasesRowsFile)
    }
    const processFile = () => {
        const processArray = []
        const errorsArray = []
        for (let i = 0; i < file.length; i++) {
            const row = file[i]

            const iccid = row[0]
            const date = row[1]
            const product = row[2]

            const rowProcessed = {
                iccid,
                date,
                product
            }

            if (!validateLength(iccid, 19)) {
                errorsArray.push(`Error en la linea ${i + 2}, el campo 'ICCID' no posee 19 caracteres.`)
            }

            if (!validateLessLength(product, 30)) {
                errorsArray.push(`Error en la linea ${i + 2}, el campo 'PRODUCTO' posee mas de 30 caracteres.`)
            }

            if (i === 0) {
                processArray.push(rowProcessed)
            } else {
                // Validate if iccid isn't repited
                const iccidRepited = processArray.filter(item => item.iccid === iccid).length > 0 ? true : false
                if (iccidRepited) {
                    errorsArray.push(`Error en la linea ${i + 2}, el campo 'ICCID' se encuentra repetido.`)

                }
                processArray.push(rowProcessed)
            }
        }
        setProcessedFile(processArray)
        setErrors(errorsArray)
    }

    const validateLength = (input, size) => {
        if (input.length === size) {
            return true
        }
        return false
    }

    const validateLessLength = (input, size) => {
        if (input.length <= size) {
            return true
        }
        return false
    }

    return (
        <React.Fragment>
            <h1>Subida de archivos de <b>Fast Track</b>.</h1>
            <h4>A continuacion se muestra el resumen de los ulitmos 3 archivos subidos:</h4>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="warning" icon>
                            <CardIcon color="warning">
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
                        <CardHeader color="warning" icon>
                            <CardIcon color="warning">
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
                                            {file.length > 0 && <Button color="warning" onClick={processFile}>Procesar Archivo</Button>}
                                        </div>
                                    </GridItem>
                                </GridContainer>
                                {/* <Button color="warning">Submit</Button> */}
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} md={8}>
                    <Card>
                        <CardHeader color="warning" icon>
                            <CardIcon color="warning">
                                <InfoIcon />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Informacion de procesamiento</h4>
                        </CardHeader>
                        <CardBody>
                            <ul>
                                <li><h4><b>Resgistros encontrados:</b> {processedFile.length}</h4></li>
                                <li><h4><b>Errores:</b> {errors.length}</h4></li>
                            </ul>
                            {
                                errors.length > 0 && <Button color="warning" onClick={() => setModal(true)}>Ver Errores</Button>
                            }
                            {
                                processedFile.length > 0 &&
                                errors.length === 0 &&
                                <Button color="warning">Guardar datos Procesados</Button>
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
                        {errors.map((error, index) => {
                            return (<li key={index}><h4><b>{index + 1}. </b>{error}</h4></li>)
                        })}
                    </ul>
                </DialogContent>
                <DialogActions
                    className={classes.modalFooter + " " + classes.modalFooterCenter}
                >
                    <Button onClick={() => setModal(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}