import React from "react";
//  Icons
import Map from "@material-ui/icons/Map";
import Eye from "@material-ui/icons/RemoveRedEye";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
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
import CustomInput from "components/CustomInput/CustomInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
import { channelZones } from "helpers/selectOptions"
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

export default function Channels() {
    const [modal, setModal] = React.useState(false)
    const [simpleSelect, setSimpleSelect] = React.useState("");

    const classes = useStyles();
    const modalClasses = useStylesModal();
    const FormClasses = useStylesForm();

    const fillButtons = [
        { color: "info", icon: Eye },
        { color: "success", icon: Edit },
        { color: "danger", icon: Close }
    ].map((prop, key) => {
        return (
            <Button color={prop.color} className={classes.actionButton} key={key}>
                <prop.icon className={classes.icon} />
            </Button>
        );
    });

    const handleSimple = event => {
        setSimpleSelect(event.target.value);
    };

    return (
        <React.Fragment>
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
                            <Table
                                tableHeaderColor="primary"
                                tableHead={[<p><b>ID</b></p>, <p><b>Nombre</b></p>, <p><b>Ciudad</b></p>, <p><b>Zona</b></p>, <p><b>Acccion</b></p>]}
                                tableData={[
                                    ["Q001", "Mileniall", "Quito", "N", fillButtons],
                                    ["Q002", "Mileniall Islas", "Quito", "N", fillButtons],
                                    ["Q003", "Zonificacion", "Quito", "S", fillButtons],
                                    ["I001", "Zonificacion", "Imbabura", "S", fillButtons],
                                    ["T001", "Zonificacion", "Tulcan", "S", fillButtons],
                                    ["S001", "Zonificacion", "Santo Domingo", "S", fillButtons],
                                    ["S002", "Zonificacion Movistar", "Santo Domingo", "M", fillButtons],
                                    ["E001", "Zonificacion", "Esmeraldas", "S", fillButtons],
                                ]}
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
                        />
                        <CustomInput
                            labelText="Ciudad"
                            id="city_channel"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text"
                            }}
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
                                value={simpleSelect}
                                onChange={handleSimple}
                                inputProps={{
                                    name: "simpleSelect",
                                    id: "simple-select"
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
                    <Button color="rose">Ingresar</Button>
                    <Button onClick={() => setModal(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}