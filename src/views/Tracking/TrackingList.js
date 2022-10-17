import React, { useEffect, useRef, useState } from "react";
import Search from "@material-ui/icons/Search";
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
import Selector from "components/CustomDropdown/CustomSelector";
// Modal
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import AdminLayout from "../../layouts/Admin";
import { Group } from "@material-ui/icons";
import moment from "moment";
import { getSellers } from "services/Users";
import { formatToSelectOption } from "helpers/utils";
import L from "leaflet";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";
import { getDeliveryRoutes } from "services/DeliveryRoutesServices";
import { getTrackByVendedor } from "services/Track";
import { getOrdersByGoeroute } from "services/Orders";

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
  },
  buttonSearch: {
    display: "flex",
    alignItems: "flex-end",
    height: "100%"
  }
};

const useStyles = makeStyles(customStyles);

export default function TrackingList() {
  const classes = useStyles();
  const [sellers, setSellers] = useState([]);
  const [route, setRoute] = useState({ fecha: new Date() });
  const [geoRoutes, setGeoroutes] = useState([]);
  const [map, setMap] = useState();
  const myRef = useRef(null);

  useEffect(() => {
    fetchSellers();
    fetchGeoroutes();
    initMap();
  }, []);

  const fetchSellers = async () => {
    const retrievedSellers = await getSellers();
    setSellers(
      formatToSelectOption(retrievedSellers.users, "id", "nombre_completo")
    );
  };

  const fetchGeoroutes = async () => {
    const retrievedGeoroutes = await getDeliveryRoutes("100", "0", "");
    const data = formatToSelectOption(
      retrievedGeoroutes.georutas,
      "georuta_id",
      "nombre"
    );
    setGeoroutes(data);
    handleRoute("ruta", data[0]);
  };

  const handleRoute = (key, value) => {
    const updatedRoute = { ...route };
    updatedRoute[key] = value;
    setRoute(updatedRoute);
  };

  const searchTrackAndOrders = async () => {
    const trackData = await getTrackByVendedor(
      route.ruta.vendedorId,
      route.fecha
    );
    const orders = await getOrdersByGoeroute(
      route.ruta.georuta_id,
      route.fecha
    );
    if (map) {
      map.remove();
      initMap(route.ruta.polygon.coordinates, trackData ?? [], orders ?? []);
      myRef.current.scrollIntoView();
    }
  };

  const initMap = (polygon, points, orders) => {
    let latitud = -0.1865938;
    let longitud = -78.570624;
    const mapLayout = L.map("RouteMap").setView([latitud, longitud], 16);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "© OpenStreetMap"
    }).addTo(mapLayout);

    const drawnItems = new L.FeatureGroup();
    mapLayout.addLayer(drawnItems);

    const info = L.control({ position: "topright" });

    info.onAdd = function() {
      const seller = sellers.find(item => item.id == route.ruta.vendedorId);
      const div = L.DomUtil.create("div", "info legend");

      div.innerHTML += "<h4><b>Datos de ruta</b></h4>";
      div.innerHTML += "<hr></hr>";

      if (seller) {
        div.innerHTML += `<p><b>Vendedor: </b>${seller.nombre_usuario}</p>`;
      }

      if (orders) {
        const ordersToDelivery = orders.filter(
          order => order.estado_pedido === "Creado"
        );
        const ordersDelivered = orders.filter(
          order => order.estado_pedido === "Entregado"
        );
        const ordersCanceled = orders.filter(
          order => order.estado_pedido === "Cancelado"
        );
        let total = 0;
        ordersDelivered.forEach(order => {
          total += +order.total;
        });
        total -= ordersCanceled.length;

        let percentege = 0;
        if (orders.length > 0) {
          percentege =
            ((ordersDelivered.length - ordersCanceled.length) / orders.length) *
            100;
        }
        div.innerHTML += `<p><b>Total de pedidos: </b>${orders.length}</p>`;
        div.innerHTML += `<p><b>Pedidos por entregar: </b>${ordersToDelivery.length}</p>`;
        div.innerHTML += `<p><b>Pedidos entregados: </b>${ordersDelivered.length}</p>`;
        div.innerHTML += `<p><b>Total Recaudado: </b> $${total}</p>`;
        div.innerHTML += `<p><b>Porcentaje de entrega: </b> %${percentege.toFixed(
          2
        )}</p>`;
      }

      return div;
    };

    info.addTo(mapLayout);

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML +=
        '<p style="margin-bottom:2px;"><i style="background: #3388ff"></i> Pedido por entregar </p>';
      div.innerHTML +=
        '<p style="margin-bottom:2px;"><i style="background: #000000"></i> Pedido entregado </p>';
      div.innerHTML +=
        '<p style="margin-bottom:2px;"><i style="background: #FF0000"></i> Pedido cancelado </p>';
      div.innerHTML +=
        '<p style="margin-bottom:2px;"><i style="background: #FFA500"></i> Ruta vendedor </p>';
      return div;
    };

    legend.addTo(mapLayout);

    if (polygon) {
      const geoRoutePolygon = L.polygon(polygon);
      drawnItems.addLayer(geoRoutePolygon);
      mapLayout.fitBounds(polygon);
    }

    if (points) {
      points.forEach((item, index) => {
        const geometry = JSON.parse(item.geometry);
        if (index === 0) {
          const marker = new L.Marker(geometry.coordinates);
          marker.bindPopup(
            `<p style="margin:0"><b>Posicion Actual</b></p>
             <p style="margin:0"><b>Fecha y Hora: </b> ${moment
               .utc(item.fecha)
               .format("DD-MM-YYYY HH:mm:ss")}
             </p>`
          );
          marker.addTo(mapLayout);
        } else {
          const marker = new L.circleMarker(geometry.coordinates, {
            color: "#FFA500"
          });
          marker.bindPopup(
            `<p> <b>Fecha y Hora: </b> ${moment
              .utc(item.fecha)
              .format("DD-MM-YYYY HH:mm:ss")}</p>`
          );
          marker.addTo(mapLayout);
        }
      });
    }

    if (orders) {
      const getColor = status => {
        if (status === "Creado") {
          return "#3388ff";
        }
        if (status === "Entregado") {
          return "#000000";
        }
        if (status === "Cancelado") {
          return "#FF0000";
        }
        return "#3388ff";
      };

      orders.forEach(order => {
        const geometry = JSON.parse(order.point);
        const marker = new L.circleMarker(geometry.coordinates, {
          color: getColor(order.estado_pedido)
        });
        marker.bindPopup(
          `<p style="margin:0;"> <b>Nombre: </b> ${order.nombre}</p>
            <p style="margin:0;"> <b>CI/RUC: </b> ${order.ruc_cedula}</p>
            <p style="margin:0;"> <b>Total pedido: </b> $${order.total}</p>`
        );
        marker.addTo(mapLayout);
      });
    }

    setMap(mapLayout);
    return mapLayout;
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Rastreo de <b>Pedidos</b>
            </h1>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Group />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Datos del ruta</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem md={5}>
                    <Selector
                      placeholder="Ruta"
                      options={geoRoutes}
                      onChange={value => handleRoute("ruta", value)}
                      value={route?.ruta}
                    />
                  </GridItem>
                  <GridItem md={5}>
                    <CustomDatePicker
                      placeholder="Fecha de entrega"
                      value={route?.fecha ?? new Date()}
                      onChange={date => handleRoute("fecha", date)}
                    />
                  </GridItem>
                  <GridItem xs={2}>
                    <div className={classes.buttonSearch}>
                      <Button
                        color="rose"
                        key="Search"
                        onClick={searchTrackAndOrders}
                      >
                        <Search /> Buscar
                      </Button>
                    </div>
                  </GridItem>
                  <GridItem md={12}>
                    <br />
                    <br />
                  </GridItem>
                  <GridItem md={12}>
                    <div
                      ref={myRef}
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
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </AdminLayout>
  );
}
