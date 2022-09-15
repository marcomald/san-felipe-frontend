/* eslint-disable react/prop-types */
import { makeStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/Admin";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import Snackbar from "components/Snackbar/Snackbar";
import Selector from "components/CustomDropdown/CustomSelector";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import MapIcon from "@material-ui/icons/Map";
import { getSellers } from "../../services/Users";
import { formatToSelectOption } from "../../helpers/utils";
import { createDeliveryRoutes } from "../../services/DeliveryRoutesServices";

// eslint-disable-next-line react/display-name

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

L.drawLocal.draw.toolbar.buttons.polygon = "Crear polígono";
L.drawLocal.draw.toolbar.undo = {
  text: "Eliminar último punto"
};
L.drawLocal.draw.toolbar.finish = {
  text: "Guardar"
};
L.drawLocal.draw.toolbar.actions = {
  text: "Cancelar"
};
L.drawLocal.edit.toolbar.actions = {
  cancel: {
    text: "Cancelar"
  },
  clearAll: {
    text: "Eliminar"
  },
  save: {
    text: "Guardar"
  }
};

export default function DeliveryRoutesForm(props) {
  const [route, setRoute] = useState({});
  const [polygon, setPolygon] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();

  const handleRoute = (key, value) => {
    const updatedRoute = { ...route };
    updatedRoute[key] = value;
    setRoute(updatedRoute);
  };

  const fetchSellers = async () => {
    const retrievedSellers = await getSellers();
    setSellers(
      formatToSelectOption(retrievedSellers.users, "id", "nombre_completo")
    );
  };

  useEffect(() => {
    let latitud = -0.1865938;
    let longitud = -78.570624;
    const mapLayout = L.map("RouteMap").setView([latitud, longitud], 16);

    if (navigator.geolocation) {
      const success = position => {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
        mapLayout.flyTo([latitud, longitud], 16);
      };
      navigator.geolocation.getCurrentPosition(success, function(msg) {
        console.error(msg);
      });
    }

    //Map configurations
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "© OpenStreetMap"
    }).addTo(mapLayout);

    const drawnItems = new L.FeatureGroup();
    mapLayout.addLayer(drawnItems);

    const drawControlFull = new L.Control.Draw({
      draw: {
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        rectangle: false,
        toolbar: {
          buttons: {
            polyline: "Dibujar poligono"
          }
        }
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    const drawControlEditOnly = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems
      },
      draw: false
    });
    mapLayout.addControl(drawControlFull);

    mapLayout.on(L.Draw.Event.CREATED, e => {
      setPolygon(e.layer.editing.latlngs[0]);
      console.log(e.layer.editing.latlngs[0]);
      drawnItems.addLayer(e.layer);
      drawControlFull.remove(mapLayout);
      drawControlEditOnly.addTo(mapLayout);
    });
    mapLayout.on(L.Draw.Event.DELETED, () => {
      if (drawnItems.getLayers().length === 0) {
        drawControlEditOnly.remove(mapLayout);
        drawControlFull.addTo(mapLayout);
      }
    });

    fetchSellers();
  }, []);

  const validateFields = () => {
    let hasError = false;
    if (!route.nombre) {
      hasError = true;
    }
    if (!route.descripcion) {
      hasError = true;
    }
    if (!route.vendedor) {
      hasError = true;
    }
    if (polygon.length <= 0) {
      hasError = true;
    }

    if (hasError) {
      setNotification({
        color: "danger",
        text: "Error! Ingrese todos los campos",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
    }
    return hasError;
  };

  const createNewGeoRoute = async () => {
    const formErrors = validateFields();
    if (!formErrors) {
      await createDeliveryRoutes({
        nombre: route.nombre,
        descripcion: route.descripcion,
        vendedorId: route.vendedor.id,
        puntos: polygon[0].map(point => [point.lat, point.lng])
      });
      setNotification({
        color: "info",
        text: "Exito, ruta de entrega creada.",
        open: true
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
    }
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Agregar nueva <b>Ruta de Entrega</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                disabled={false}
                onClick={createNewGeoRoute}
              >
                <Add /> Crear Ruta de Entrega
              </Button>
              <Button
                color="rose"
                id="addClientBtn"
                onClick={() =>
                  props.history.push("/mantenimiento/rutas-de-entrega")
                }
              >
                Regresar
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
                <h4 className={classes.cardIconTitle}>
                  Ingrese los siguientes datos
                </h4>
              </CardHeader>
              <CardBody>
                <form>
                  <GridContainer>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Nombre"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={route.nombre}
                        onChange={e => handleRoute("nombre", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Descripción"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={route.descripcion}
                        onChange={e =>
                          handleRoute("descripcion", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Vendedor"
                        options={sellers}
                        onChange={value => handleRoute("vendedor", value)}
                        value={route.vendedor}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <div
                        id="RouteMap"
                        style={{
                          width: "100%",
                          height: "80vh",
                          marginTop: "5rem",
                          zIndex: 10
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <br />
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
      </React.Fragment>
    </AdminLayout>
  );
}
