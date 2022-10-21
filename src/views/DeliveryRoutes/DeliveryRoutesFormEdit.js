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
import {
  getDeliveryRouteById,
  updateDeliveryRoutes
} from "../../services/DeliveryRoutesServices";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";
import { getOrders } from "services/Orders";
import moment from "moment";
import LoaderComponent from "components/Loader/Loader";

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

export default function DeliveryRoutesFormEdit(props) {
  const routeId = props.match.params.id;
  const [route, setRoute] = useState({});
  const [polygon, setPolygon] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [map, setMap] = useState();
  const [loading, setLoading] = useState(false);
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
    if (retrievedSellers?.users) {
      const formatedSellers = formatToSelectOption(
        retrievedSellers.users,
        "id",
        "nombre_completo"
      );
      setSellers(formatedSellers);
      return formatedSellers;
    }
    return [];
  };

  const initMap = (ordersClients, polygon) => {
    let latitud = -0.1865938;
    let longitud = -78.570624;
    const mapLayout = L.map("RouteMap").setView([latitud, longitud], 16);

    //Map configurations
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "© OpenStreetMap"
    }).addTo(mapLayout);

    if (ordersClients && ordersClients.length > 0) {
      const boundsArray = [];
      ordersClients.forEach(order => {
        const geometry = JSON.parse(order.point);
        boundsArray.push(geometry.coordinates);
        const marker = new L.CircleMarker(geometry.coordinates);
        marker.addTo(mapLayout);
      });
      const bounds = new L.LatLngBounds(boundsArray);
      mapLayout.fitBounds(bounds);
    }

    const drawnItems = new L.FeatureGroup();
    mapLayout.addLayer(drawnItems);

    if (polygon) {
      const geoRoutePolygon = L.polygon(polygon);
      drawnItems.addLayer(geoRoutePolygon);
      mapLayout.fitBounds(polygon);
    }

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

    setMap(mapLayout);
  };

  useEffect(() => {
    fetchGeoroute();
  }, []);

  const validateFields = () => {
    let hasError = false;
    if (!route.nombre) {
      hasError = true;
    }
    if (!route.fecha) {
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

  const updateGeoRoute = async () => {
    const formErrors = validateFields();
    if (!formErrors) {
      setLoading(true);
      await updateDeliveryRoutes(routeId, {
        nombre: route.nombre,
        descripcion: route.descripcion,
        vendedorId: route.vendedor.id,
        puntos: polygon[0].map(point => [point.lat, point.lng])
      });
      setNotification({
        color: "info",
        text: "Exito, ruta de entrega actualizada.",
        open: true
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
      setLoading(false);
    }
  };

  const fetchOrders = async (
    offsetFetch,
    limitFetch,
    searchFetch,
    deliveryDate,
    georutaId
  ) => {
    const ordersRetrieved = await getOrders(
      limitFetch,
      offsetFetch,
      searchFetch,
      deliveryDate,
      georutaId
    );
    return ordersRetrieved;
  };

  const fetchGeoroute = async () => {
    setLoading(true);
    const ordersRetrieved = await fetchOrders("", "", "", "", routeId);
    const retrievedGeoroute = await getDeliveryRouteById(routeId);
    const polygons = [
      retrievedGeoroute.polygon.coordinates[0].map(coords => {
        return { lat: coords[0], lng: coords[1] };
      })
    ];
    const sellers = await fetchSellers();
    const selectedSeller = sellers.find(
      item => item.id === retrievedGeoroute.vendedorId
    );
    if (selectedSeller) {
      const date = moment.utc(retrievedGeoroute.fecha);
      const year = date.format("YYYY");
      const month = date.format("MM");
      const day = date.format("DD");
      setRoute({
        ...retrievedGeoroute,
        fecha: new Date([year, month, day]),
        vendedor: {
          ...selectedSeller,
          value: selectedSeller.id,
          label: selectedSeller.nombre_completo
        }
      });
    }
    setPolygon(polygons);
    initMap(ordersRetrieved.orders, polygons);
    setLoading(false);
  };

  const onSelectDate = async date => {
    await fetchOrders("", "", "", date, "");
    handleRoute("fecha", date);
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Editar nueva <b>Ruta de Entrega</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button color="primary" disabled={false} onClick={updateGeoRoute}>
                <Add /> Actualizar Ruta de Entrega
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
                      <CustomDatePicker
                        placeholder="Fecha de entrega"
                        value={route?.fecha}
                        onChange={onSelectDate}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Vendedor"
                        options={sellers}
                        onChange={value => handleRoute("vendedor", value)}
                        value={route?.vendedor}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Nombre"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={route?.nombre}
                        onChange={e => handleRoute("nombre", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
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
      </React.Fragment>
    </AdminLayout>
  );
}
