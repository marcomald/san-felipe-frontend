/* eslint-disable react/prop-types */
import { makeStyles } from "@material-ui/core";
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
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import MapIcon from "@material-ui/icons/Map";
import { getDeliveryRouteById } from "../../services/DeliveryRoutesServices";
import Selector from "components/CustomDropdown/CustomSelector";

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

const visitFrequencyList = [
  { label: "Todos", value: "" },
  { label: "Lunes", value: "L" },
  { label: "Martes", value: "M" },
  { label: "Miércoles", value: "X" },
  { label: "Jueves", value: "J" },
  { label: "Viernes", value: "V" },
  { label: "Sábado", value: "S" },
  { label: "Domingo", value: "D" }
];

export default function DeliveryRoutesClients(props) {
  const routeId = props.match.params.id;
  const [route, setRoute] = useState({});
  const [visitFrequency, setVisitFrequency] = useState(visitFrequencyList[0]);
  const classes = useStyles();
  const [map, setMap] = useState();

  const fetchGeoroute = async frecuency => {
    const retrievedGeoroute = await getDeliveryRouteById(routeId, frecuency);
    setRoute(retrievedGeoroute);
    return retrievedGeoroute;
  };

  const initMap = (polygon, clients) => {
    let latitud = -0.1865938;
    let longitud = -78.570624;
    const mapLayout = L.map("RouteMap").setView([latitud, longitud], 16);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "© OpenStreetMap"
    }).addTo(mapLayout);

    const drawnItems = new L.FeatureGroup();
    mapLayout.addLayer(drawnItems);

    const geoRoutePolygon = L.polygon(polygon);
    drawnItems.addLayer(geoRoutePolygon);
    mapLayout.fitBounds(polygon);

    clients.forEach(client => {
      const geometry = JSON.parse(client.geometry);
      const marker = new L.Marker(geometry.coordinates);
      marker.bindPopup(
        `<p>Nombre: <b>${client.nombre}</b></p><p>RUC/CI: <b>${client.ruc_cedula}</b></p>`
      );
      marker.addTo(mapLayout);
    });
    setMap(mapLayout);
    return mapLayout;
  };

  useEffect(() => {
    const getData = async () => {
      const retrievedGeoroute = await fetchGeoroute(
        visitFrequencyList[0].value
      );
      initMap(
        retrievedGeoroute.polygon.coordinates[0],
        retrievedGeoroute.clients
      );
    };
    getData();
  }, []);

  const onChangeFrequency = async frecuency => {
    setVisitFrequency(frecuency);
    const retrievedGeoroute = await fetchGeoroute(frecuency.value);
    if (map) {
      map.remove();
      initMap(
        retrievedGeoroute.polygon.coordinates[0],
        retrievedGeoroute.clients
      );
    }
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>
              Ver clientes de <b>Ruta de Entrega</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <div className={classes.buttonContainer}>
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
                  Datos generales de la ruta
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
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Clientes en la ruta"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={
                          route.clients && route.clients.length
                            ? route.clients.length
                            : "0"
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Frecuencia de visita"
                        options={visitFrequencyList}
                        onChange={onChangeFrequency}
                        value={visitFrequency}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <div
                        id="RouteMap"
                        style={{
                          width: "100%",
                          height: "80vh",
                          marginTop: "2rem",
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
      </React.Fragment>
    </AdminLayout>
  );
}
