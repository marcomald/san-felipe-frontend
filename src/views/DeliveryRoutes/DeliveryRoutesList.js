import React, { useEffect, useState } from "react";
import moment from "moment";
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
import Snackbar from "components/Snackbar/Snackbar.js";
import Tooltip from "@material-ui/core/Tooltip";
// Modal
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import AdminLayout from "../../layouts/Admin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from "@material-ui/core";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import MapIcon from "@material-ui/icons/Map";
import {
  deleteDeliveryRoute,
  getDeliveryRoutes
} from "../../services/DeliveryRoutesServices";
import { Edit } from "@material-ui/icons";
import LoaderComponent from "components/Loader/Loader";

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
const useTableStyles = makeStyles(TableStyles);
const useStylesModal = makeStyles(Modalstyles);

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DeliveryRoutesList(props) {
  const classes = useStyles();
  const classesTable = useTableStyles();
  const modalClasses = useStylesModal();
  const [geoRoutes, setGeoroutes] = useState({ georutas: [], total: 0 });
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showDelete, setShowDelete] = useState(false);
  const [geoRoute, setGeoRoute] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });

  useEffect(() => {
    fetchGeoroutes();
  }, [offset, limit, search]);

  const fetchGeoroutes = async () => {
    setLoading(true);
    const retrievedGeoroutes = await getDeliveryRoutes(limit, offset, search);
    setGeoroutes(retrievedGeoroutes);
    setLoading(false);
  };

  const fillButtons = route => {
    return [
      { color: "rose", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger"
              ? "Eliminar ruta de entrega"
              : "Editar ruta de entrega"
          }
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classesTable.actionButton}
            key={key}
            onClick={() => {
              setGeoRoute(route);
              if (prop.color === "danger") {
                setShowDelete(true);
              } else {
                props.history.push(
                  "/mantenimiento/rutas-de-entrega/editar/" + route.georuta_id
                );
              }
            }}
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const deleteCurrentGeoroute = async () => {
    await deleteDeliveryRoute(geoRoute.georuta_id);
    await fetchGeoroutes();
    setNotification({
      color: "info",
      text: "Exito! Ruta de envio eliminada.",
      open: true
    });
    setTimeout(function() {
      setNotification({
        ...notification,
        open: false
      });
    }, 6000);
    setShowDelete(false);
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Rutas de <b>Entrega</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                key="AddButton1"
                onClick={() =>
                  // eslint-disable-next-line react/prop-types
                  props.history.push("/mantenimiento/rutas-de-entrega/crear")
                }
              >
                <Add /> Agregar Ruta
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <MapIcon />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Rutas registradas</h4>
              </CardHeader>
              <CardBody>
                <CustomTable
                  data={
                    geoRoutes?.georutas?.map(item => {
                      return [
                        item?.nombre,
                        moment.utc(item?.fecha).format("DD-MM-YYYY"),
                        item?.estado === "A" ? "Activo" : "Inactivo",
                        fillButtons(item)
                      ];
                    }) ?? []
                  }
                  limite={10}
                  headers={["Nombre", "Fecha", "Estado", "Acciones"]}
                  onOffsetChange={valueOffset => {
                    setOffset(valueOffset);
                  }}
                  onSearchChange={name => {
                    setSearch(name);
                  }}
                  total={geoRoute.total}
                  changeLimit={limite => {
                    setLimit(limite);
                  }}
                  offset={offset}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
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
        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={showDelete}
          transition={Transition}
          keepMounted
          onClose={() => setShowDelete(false)}
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
              Eliminar <b>{geoRoute.nombre}</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <h4>
              Esta seguro que desea <b>eliminar</b> la ruta de entrega?
            </h4>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button color="danger" onClick={deleteCurrentGeoroute}>
              Eliminar
            </Button>
            <Button
              onClick={() => {
                setShowDelete(false);
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </AdminLayout>
  );
}
