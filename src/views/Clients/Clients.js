/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
//  Icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
// import CloudUpload from "@material-ui/icons/CloudUpload";
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
import AdminLayout from "layouts/Admin";
import { deleteClient, getClients } from "../../services/Clients";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
import LoaderComponent from "components/Loader/Loader";

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
    height: "100%"
  }
};

const useStyles = makeStyles(customStyles);
const useStylesModal = makeStyles(Modalstyles);

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Clients(props) {
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [clients, setClients] = React.useState({ clients: [], total: 0 });
  const [client, setClient] = React.useState({});
  const [notification, setNotification] = React.useState({
    color: "info",
    text: "",
    open: false
  });
  const [clientSearch, setClientSearch] = React.useState("");
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    fetchClients();
  }, [offset, limit, clientSearch]);

  const fetchClients = async () => {
    setLoading(true);
    const retrievedClients = await getClients(limit, offset, clientSearch);
    setClients(retrievedClients);
    setLoading(false);
  };

  const classes = useStyles();
  const modalClasses = useStylesModal();

  const fillButtons = cl => {
    return [
      { color: "success", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger" ? "Eliminar cliente" : "Editar cliente"
          }
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classes.actionButton}
            onClick={() => {
              setClient(cl);
              prop.color === "danger"
                ? setDeleteModal(true)
                : props.history.push(
                    "/mantenimiento/clientes/editar/" + cl.cliente_id
                  );
            }}
          >
            <prop.icon className={classes.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const deleteCurrentClient = async () => {
    const deleted = await deleteClient(client.cliente_id);
    if (deleted) {
      fetchClients();
      setNotification({
        color: "info",
        text: "Exito! Cliente eliminado.",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 6000);
    }
    setDeleteModal(false);
  };

  return (
    <AdminLayout>
      <GridContainer>
        <GridItem xs={12} sm={6}>
          <h1>Clientes</h1>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <div className={classes.buttonContainer}>
            <Button
              color="rose"
              key="AddButton1"
              id="addClientBtn"
              onClick={() =>
                props.history.push("/mantenimiento/clientes/crear")
              }
            >
              <Add /> Agregar Cliente
            </Button>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <AssignmentInd />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Clientes registrados</h4>
            </CardHeader>
            <CardBody>
              <CustomTable
                data={clients.clients.map(cl => {
                  return [
                    cl.ruc_cedula,
                    cl.nombre,
                    cl.estado.toUpperCase() === "A" ? "Activo" : "Inactivo",
                    fillButtons(cl)
                  ];
                })}
                limite={10}
                headers={["RUC/CI", "Nombre", "Estado", "Acccion"]}
                onOffsetChange={valueOffset => {
                  setOffset(valueOffset);
                }}
                total={clients.total}
                changeLimit={limite => {
                  setLimit(limite);
                }}
                offset={offset}
                onSearchChange={name => {
                  setClientSearch(name);
                }}
                searchValue={clientSearch}
                showSearch={true}
                placeholderSearch={"Ejemplo: EDUARDO LOPEZ O 172405872"}
                labelSearch={"Nombre de cliente o RUC/CI a buscar"}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Dialog
        classes={{
          root: modalClasses.center,
          paper: modalClasses.modal
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
          <h3 className={modalClasses.modalTitle}>
            Eliminar cliente <b>{client.nombre}</b>
          </h3>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={modalClasses.modalBody}
        >
          <h4>
            Esta seguro que desea <b>eliminar</b> el cliente?
          </h4>
        </DialogContent>
        <DialogActions
          className={
            modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
          }
        >
          <Button color="danger" onClick={deleteCurrentClient}>
            Eliminar
          </Button>
          <Button
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {loading && <LoaderComponent />}

      <Snackbar
        place="br"
        color={notification.color}
        message={notification.text}
        open={notification.open}
        closeNotification={() => {
          const noti = { ...notification, open: false };
          setNotification(noti);
        }}
        close
      />
    </AdminLayout>
  );
}
