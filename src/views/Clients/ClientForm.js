/* eslint-disable react/prop-types */
import { makeStyles } from "@material-ui/core";
import { AssignmentInd } from "@material-ui/icons";
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
import Snackbar from "components/Snackbar/Snackbar";
import Selector from "components/CustomDropdown/CustomSelector";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { getTerritories } from "../../services/Territory";
import { getBusiness } from "../../services/Business";
import { formatToSelectOption } from "../../helpers/utils";
import { getPriceList } from "../../services/PriceList";
import Button from "components/CustomButtons/Button.js";
import Search from "@material-ui/icons/Search";
import "leaflet/dist/images/marker-shadow.png";
import {
  createClient
  // validateExistClientByDocument
} from "../../services/Clients";
import Add from "@material-ui/icons/Add";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import { PAYMENT_LIST } from "helpers/constants";
import LoaderComponent from "components/Loader/Loader";
import { DOCUMENT_TYPE } from "helpers/constants";

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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default function ClientForm(props) {
  const [client, setClient] = useState({});
  const [coords, setCoords] = useState({ latitud: 0, longitud: 0 });
  const [business, setBusiness] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [visitFrequency, setVisitFrequency] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState();
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();

  const handleClient = (key, value) => {
    const updatedClient = { ...client };
    updatedClient[key] = value;
    setClient(updatedClient);
  };

  useEffect(() => {
    fetchTerritories();
    fetchBusiness();
    fetchListPrice();
  }, []);

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
      maxZoom: 26,
      attribution: "© OpenStreetMap"
    }).addTo(mapLayout);

    mapLayout.on("click", e => {
      mapLayout.eachLayer(layer => {
        if (!layer._url) {
          mapLayout.removeLayer(layer);
        }
      });
      new L.marker(e.latlng).addTo(mapLayout);
      mapLayout.flyTo([e.latlng.lat, e.latlng.lng], 16);
      setCoords({ longitud: e.latlng.lng, latitud: e.latlng.lat });
    });

    setMap(mapLayout);
  }, []);

  const fetchTerritories = async () => {
    const retrievedTerritories = await getTerritories("", "", "");
    setTerritories(
      formatToSelectOption(retrievedTerritories, "territorio_id", "descripcion")
    );
  };

  const fetchBusiness = async () => {
    const retrievedBusiness = await getBusiness("", "", "");
    setBusiness(
      formatToSelectOption(retrievedBusiness, "negocio_id", "nombre")
    );
  };

  const fetchListPrice = async () => {
    const retrievedBusiness = await getPriceList("", "", "");
    setPriceList(
      formatToSelectOption(retrievedBusiness, "listapre_id", "descripcion")
    );
  };

  const searchLocation = () => {
    if (coords.latitud && coords.longitud) {
      map.eachLayer(layer => {
        if (!layer._url) {
          map.removeLayer(layer);
        }
      });
      map.flyTo([coords.latitud, coords.longitud], 16);
      const marker = new L.Marker([coords.latitud, coords.longitud]);
      marker.addTo(map);
    }
  };

  const validateFields = async () => {
    let hasError = false;
    if (!client.nombre) {
      hasError = true;
    }
    if (!client.razon_social) {
      hasError = true;
    }
    if (!client.ruc_cedula) {
      hasError = true;
    }
    if (!client.direccion) {
      hasError = true;
    }
    if (!client.num_casa) {
      hasError = true;
    }
    if (!client.telefono) {
      hasError = true;
    }
    if (!client.celular) {
      hasError = true;
    }
    if (!client.correo_elec) {
      hasError = true;
    }
    if (!client.contacto) {
      hasError = true;
    }
    if (!client.negocio_id) {
      hasError = true;
    }
    if (!client.territorio_id) {
      hasError = true;
    }
    if (!client.listapre_id) {
      hasError = true;
    }
    if (!coords.latitud) {
      hasError = true;
    }
    if (!coords.longitud) {
      hasError = true;
    }
    if (visitFrequency.length <= 0) {
      hasError = true;
    }

    // const existClient = await validateExistClientByDocument(client.ruc_cedula);
    // if (existClient) {
    //   hasError = true;
    //   setNotification({
    //     color: "danger",
    //     text: "Error! Ya existe un cliente con la cedula/ruc ingresada",
    //     open: true
    //   });
    //   setTimeout(function() {
    //     setNotification({
    //       ...notification,
    //       open: false
    //     });
    //   }, 10000);
    //   return hasError;
    // }

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

  const createNewClient = async () => {
    const formErrors = await validateFields();
    if (!formErrors) {
      setLoading(true);
      let frecvisita_id = "";
      visitFrequency.forEach(day => {
        frecvisita_id = `${frecvisita_id}${day}`;
      });
      const created = await createClient({
        ...client,
        tipcli: client.tipcli.value,
        ayudante_id: "00",
        grupocli_id: "01",
        empresa_id: "FSF",
        sucursal_id: "002",
        ctacon_id: "1130401001",
        negocio_id: client.negocio_id.negocio_id,
        territorio_id: client.territorio_id.territorio_id,
        listapre_id: client.listapre_id.listapre_id,
        cliente_id: new Date().getTime().toString(),
        estado: "A",
        latitud: coords.latitud,
        longitud: coords.longitud,
        frecvisita_id,
        formapago_id: client.formapago_id.value
      });
      if (created) {
        setClient({});
        setNotification({
          color: "info",
          text: "Exito, cliente creado.",
          open: true
        });
        setTimeout(() => {
          setNotification({
            ...notification,
            open: false
          });
        }, 10000);
      }
      setLoading(false);
    }
  };

  const toggleFrequency = day => {
    const freuency = [...visitFrequency];
    if (visitFrequency.some(visitedDay => visitedDay === day)) {
      setVisitFrequency(freuency.filter(visitedDay => visitedDay !== day));
      return;
    }
    setVisitFrequency([...freuency, day]);
  };

  const onHandleTypeDocument = value => {
    const updatedClient = { ...client };
    setClient({ ...updatedClient, ruc_cedula: "", tipcli: value });
  };

  const onHandleIdentification = value => {
    if (client.tipcli.value === "C") {
      const reg = new RegExp(/^$|^[0-9]+$/);
      if (reg.test(value) && value.length <= 10) {
        handleClient("ruc_cedula", value);
      }
    }
    if (client.tipcli.value === "R") {
      const reg = new RegExp(/^$|^[0-9]+$/);
      if (reg.test(value) && value.length <= 13) {
        handleClient("ruc_cedula", value);
      }
    }
    if (client.tipcli.value === "O") {
      const reg = new RegExp(/^$|^[a-z0-9]+$/i);
      if (reg.test(value) && value.length <= 15) {
        handleClient("ruc_cedula", value);
      }
    }
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Agregar nuevo <b>Cliente</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                id="addClientBtn"
                onClick={createNewClient}
              >
                <Add /> Crear Cliente
              </Button>
              <Button
                color="rose"
                id="addClientBtn"
                onClick={() => props.history.push("/mantenimiento/clientes")}
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
                  <AssignmentInd />
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
                        value={client.nombre}
                        onChange={e => handleClient("nombre", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={60}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Razón Social"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.razon_social}
                        onChange={e =>
                          handleClient("razon_social", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={50}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Tipo de Identificación"
                        options={DOCUMENT_TYPE}
                        onChange={onHandleTypeDocument}
                        value={client.tipcli}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText={client?.tipcli?.label ?? "Identificación"}
                        id="ruc/ci"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.ruc_cedula}
                        onChange={e => onHandleIdentification(e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled={!client.tipcli}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Direccion"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.direccion}
                        onChange={e =>
                          handleClient("direccion", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={60}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="# Casa"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.num_casa}
                        onChange={e => handleClient("num_casa", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={10}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Teléfono"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.telefono}
                        onChange={e => handleClient("telefono", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={20}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Celular"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.celular}
                        onChange={e => handleClient("celular", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={20}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Correo electrónico"
                        id="correo"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.correo_elec}
                        onChange={e =>
                          handleClient("correo_elec", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={60}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Negocio"
                        options={business}
                        onChange={value => handleClient("negocio_id", value)}
                        value={client.negocio_id}
                      />
                    </GridItem>
                    <br />
                    <GridItem md={6}>
                      <Selector
                        placeholder="Territorio"
                        options={territories}
                        onChange={value => handleClient("territorio_id", value)}
                        value={client.territorio_id}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Precio"
                        options={priceList}
                        onChange={value => handleClient("listapre_id", value)}
                        value={client.listapre_id}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Forma de pago"
                        options={PAYMENT_LIST}
                        onChange={value => handleClient("formapago_id", value)}
                        value={client.formapago_id}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Comentario"
                        id="contacto"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.contacto}
                        onChange={e => handleClient("contacto", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        limit={50}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <hr />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>Frecuencia de visita</h4>
                      <CustomCheckBox
                        labelText="Lunes"
                        onClick={() => toggleFrequency("L")}
                        checked={visitFrequency.some(day => day === "L")}
                      />
                      <CustomCheckBox
                        labelText="Martes"
                        onClick={() => toggleFrequency("M")}
                        checked={visitFrequency.some(day => day === "M")}
                      />
                      <CustomCheckBox
                        labelText="Miércoles"
                        onClick={() => toggleFrequency("X")}
                        checked={visitFrequency.some(day => day === "X")}
                      />
                      <CustomCheckBox
                        labelText="Jueves"
                        onClick={() => toggleFrequency("J")}
                        checked={visitFrequency.some(day => day === "J")}
                      />
                      <CustomCheckBox
                        labelText="Viernes"
                        onClick={() => toggleFrequency("V")}
                        checked={visitFrequency.some(day => day === "V")}
                      />
                      <CustomCheckBox
                        labelText="Sábado"
                        onClick={() => toggleFrequency("S")}
                        checked={visitFrequency.some(day => day === "S")}
                      />
                      <CustomCheckBox
                        labelText="Domingo"
                        onClick={() => toggleFrequency("D")}
                        checked={visitFrequency.some(day => day === "D")}
                      />
                    </GridItem>
                  </GridContainer>

                  <hr />
                  <h4>Georeferencia:</h4>
                  <GridContainer>
                    <GridItem md={4}>
                      <CustomInput
                        labelText="Latitud"
                        id="contacto"
                        inputProps={{
                          type: "number"
                        }}
                        value={coords.latitud}
                        onChange={e =>
                          setCoords({ ...coords, latitud: e.target.value })
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <CustomInput
                        labelText="Longitud"
                        id="contacto"
                        inputProps={{
                          type: "number"
                        }}
                        value={coords.longitud}
                        onChange={e =>
                          setCoords({ ...coords, longitud: e.target.value })
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <div className={classes.buttonContainer}>
                        <Button
                          color="rose"
                          id="addClientBtn"
                          onClick={searchLocation}
                        >
                          <Search /> Buscar ubicación
                        </Button>
                      </div>
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
                    <div className={classes.buttonContainer}>
                      <Button
                        color="primary"
                        id="addClientBtn"
                        onClick={createNewClient}
                      >
                        <Add /> Crear Cliente
                      </Button>
                    </div>
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
