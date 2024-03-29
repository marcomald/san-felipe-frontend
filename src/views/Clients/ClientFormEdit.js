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
import { formatToSelectOption, getUserId } from "../../helpers/utils";
import { getPriceList } from "../../services/PriceList";
import Button from "components/CustomButtons/Button.js";
import Search from "@material-ui/icons/Search";
import "leaflet/dist/images/marker-shadow.png";
import { getClientByID, updateClient } from "../../services/Clients";
import Add from "@material-ui/icons/Add";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import { PAYMENT_LIST } from "helpers/constants";
import LoaderComponent from "components/Loader/Loader";
import { DOCUMENT_TYPE } from "helpers/constants";
import { RESPONSIBLE_LIST } from "helpers/constants";

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

export default function ClientFormEdit(props) {
  const clientID = props.match.params.id;
  const [client, setClient] = useState({});
  const [firstClient, setFirstClient] = useState({});
  const [coords, setCoords] = useState({ latitud: 0, longitud: 0 });
  const [business, setBusiness] = useState([]);
  const [visitFrequency, setVisitFrequency] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [map, setMap] = useState();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();

  const handleClient = (key, value) => {
    const updatedRoute = { ...client };
    updatedRoute[key] = value;
    setClient(updatedRoute);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTerritories();
      await fetchBusiness();
      await fetchListPrice();
      await fetchClient();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selectedPriceList = priceList.find(
      item =>
        item.listapre_id === firstClient.listapre_id &&
        item.sucursal_id === firstClient.sucursal_id
    );
    const selectedBusiness = business.find(
      item => item.negocio_id === firstClient.negocio_id
    );
    const selectedTerritory = territories.find(
      item => item.territorio_id === firstClient.territorio_id
    );
    const selectedDocumentType = DOCUMENT_TYPE.find(
      item => item.value === firstClient.tipcli
    );
    setClient({
      ...firstClient,
      tipcli: selectedDocumentType,
      formapago_id: PAYMENT_LIST.find(
        payment => payment.value === firstClient.formapago_id
      ),
      ayudante_id: RESPONSIBLE_LIST.find(
        ayudante => ayudante.value === firstClient.ayudante_id
      ),
      listapre_id: {
        ...selectedPriceList,
        value: selectedPriceList?.listapre_id,
        label: selectedPriceList?.descripcion
      },
      negocio_id: {
        ...selectedBusiness,
        value: selectedBusiness?.negocio_id,
        label: selectedBusiness?.nombre
      },
      territorio_id: {
        ...selectedTerritory,
        value: selectedTerritory?.territorio_id,
        label: selectedTerritory?.descripcion
      }
    });
  }, [business, priceList, territories, firstClient]);

  const initMap = () => {
    let latitud = coords.latitud > 0 ? coords.latitud : -0.1865938;
    let longitud = coords.longitud > 0 ? coords.longitud : -78.570624;
    const mapLayout = L.map("RouteMap").setView([latitud, longitud], 16);

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
    return mapLayout;
  };

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

  const fetchClient = async () => {
    setLoading(true);
    const mapLayout = initMap();
    const retrievedClient = await getClientByID(clientID);
    if (retrievedClient) {
      setFirstClient(retrievedClient);
      const frequency = [];
      if (
        retrievedClient &&
        retrievedClient.frecvisita_id &&
        retrievedClient.frecvisita_id.length > 0
      ) {
        for (
          let index = 0;
          index < retrievedClient.frecvisita_id.length;
          index += 1
        ) {
          const day = retrievedClient.frecvisita_id[index];
          frequency.push(day);
        }
        setVisitFrequency(frequency);
      }

      if (retrievedClient?.point?.coordinates.length > 0) {
        const lat = retrievedClient.point.coordinates[0];
        const lng = retrievedClient.point.coordinates[1];
        setCoords({
          latitud: lat,
          longitud: lng
        });
        mapLayout.flyTo([lat, lng], 16);
        const marker = new L.Marker([lat, lng]);
        marker.addTo(mapLayout);
      }
    }
    setLoading(false);
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

  const validateFields = () => {
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
    if (!client.formapago_id) {
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

  const updateCurrentClient = async () => {
    const formErrors = validateFields();
    if (!formErrors) {
      setLoading(true);
      let frecvisita_id = "";
      visitFrequency.forEach(day => {
        frecvisita_id = `${frecvisita_id}${day}`;
      });
      const created = await updateClient(
        {
          ...client,
          tipcli: client.tipcli?.value || "O",
          ayudante_id: client.ayudante_id.value,
          grupocli_id: "01",
          empresa_id: "FSF",
          sucursal_id: "002",
          ctacon_id: "1130401001",
          negocio_id: client.negocio_id.negocio_id,
          territorio_id: client.territorio_id.territorio_id,
          listapre_id: client.listapre_id.listapre_id,
          estado: "A",
          latitud: coords.latitud,
          longitud: coords.longitud,
          frecvisita_id,
          formapago_id: client.formapago_id.value,
          user_id: getUserId()
        },
        clientID
      );
      if (created) {
        setNotification({
          color: "info",
          text: "Exito, cliente actualizado.",
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

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Editar <b>Cliente</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                id="addClientBtn"
                onClick={updateCurrentClient}
              >
                <Add /> Actualizar Cliente
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
                        labelText="Código de cliente"
                        id="code"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.cliente_id}
                        onChange={e =>
                          handleClient("cliente_id", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}></GridItem>
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
                        onChange={() => true}
                        value={client.tipcli}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText={client?.tipcli?.label ?? "RUC/Cedula"}
                        id="ruc/ci"
                        inputProps={{
                          type: "text"
                        }}
                        value={client.ruc_cedula}
                        onChange={e =>
                          handleClient("ruc_cedula", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
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
                        limit={199}
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
                      <Selector
                        placeholder="Responsable"
                        options={RESPONSIBLE_LIST}
                        onChange={value => handleClient("ayudante_id", value)}
                        value={client.ayudante_id}
                      />
                    </GridItem>
                    <GridItem md={12}>
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
                        limit={199}
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
                        onClick={updateCurrentClient}
                      >
                        <Add /> Actualizar Cliente
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
