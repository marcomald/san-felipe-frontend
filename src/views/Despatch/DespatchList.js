import React, { useEffect, useState } from "react";
//  Icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
// Components
import { makeStyles } from "@material-ui/core/styles";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
// Modal
import AdminLayout from "../../layouts/Admin";
import { AssignmentInd } from "@material-ui/icons";
import moment from "moment";
import LoaderComponent from "components/Loader/Loader";
import CustomTable from "components/Table/CustomTable";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Tooltip
} from "@material-ui/core";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Snackbar from "components/Snackbar/Snackbar";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { getDespatchs } from "services/Despatch";
import { deleteDespatch } from "services/Despatch";

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
export default function DespatchList(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [data, setData] = useState({ despatchs: [], total: 0 });
  const [despatchSelected, setDespatchSelected] = useState({});
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDespatch();
  }, [offset, limit]);

  const fetchDespatch = async () => {
    setLoading(true);
    const retrievedDespatch = await getDespatchs(limit, offset, "", "");
    setData(retrievedDespatch);
    setLoading(false);
  };

  const classes = useStyles();
  const modalClasses = useStylesModal();

  const fillButtons = despatch => {
    return [
      { color: "success", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger" ? "Eliminar despacho" : "Editar despacho"
          }
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classes.actionButton}
            onClick={() => {
              setDespatchSelected(despatch);
              prop.color === "danger"
                ? setDeleteModal(true)
                : props.history.push(
                    "/mantenimiento/despacho/editar/" + despatch.despatch_id
                  );
            }}
          >
            <prop.icon className={classes.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const deleteSelectedDespatch = async () => {
    const deleted = await deleteDespatch(despatchSelected.despatch_id);
    if (deleted) {
      fetchDespatch();
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
          <h1>
            Despacho de <b>Pedidos</b>
          </h1>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <div className={classes.buttonContainer}>
            <Button
              color="rose"
              key="AddButton1"
              id="addClientBtn"
              onClick={() =>
                // eslint-disable-next-line react/prop-types
                props.history.push("/mantenimiento/despacho/crear")
              }
            >
              <Add /> Registrar despacho
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
              <h4 className={classes.cardIconTitle}>Despachos registrados</h4>
            </CardHeader>
            <CardBody>
              <CustomTable
                data={data.despatchs.map(despatch => {
                  return [
                    despatch?.despatch_number ?? 1,
                    despatch?.nombre,
                    moment.utc(despatch?.date).format("DD-MM-YYYY"),
                    despatch.estado.toUpperCase() === "A"
                      ? "Activo"
                      : "Inactivo",
                    fillButtons(despatch)
                  ];
                })}
                limite={10}
                headers={[
                  "Número Despacho",
                  "Ruta",
                  "Fecha",
                  "Estado",
                  "Acccion"
                ]}
                onOffsetChange={valueOffset => {
                  setOffset(valueOffset);
                }}
                total={data.total}
                changeLimit={limite => {
                  setLimit(limite);
                }}
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
          <h3 className={modalClasses.modalTitle}>Eliminar despacho</h3>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={modalClasses.modalBody}
        >
          <h4>
            Esta seguro que desea <b>eliminar</b> el despacho?
          </h4>
        </DialogContent>
        <DialogActions
          className={
            modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
          }
        >
          <Button color="danger" onClick={deleteSelectedDespatch}>
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
