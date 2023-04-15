/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Slide,
  Tooltip
} from "@material-ui/core";
import AsyncSelector from "components/CustomDropdown/CustomAsyncSelector";
import { AssignmentInd, Close } from "@material-ui/icons";
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
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { formatToSelectOption } from "../../helpers/utils";
import Button from "components/CustomButtons/Button.js";
import "leaflet/dist/images/marker-shadow.png";
import Add from "@material-ui/icons/Add";
import LoaderComponent from "components/Loader/Loader";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";
import moment from "moment";
import { getDeliveryRoutes } from "services/DeliveryRoutesServices";
import CustomTable from "components/Table/CustomTable";
import { getDeliveryRouteProducts } from "services/DeliveryRoutesServices";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import { getProducts } from "services/Products";
import { getDespatchById } from "services/Despatch";
import { getDeliveryRouteById } from "services/DeliveryRoutesServices";
import { updateDespatch } from "services/Despatch";

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStylesModal = makeStyles(Modalstyles);
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

export default function DespatchFormEdit(props) {
  const [despatch, setDespatch] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [georoutes, setGeoroutes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [retrievedProducts, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState();
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();
  const modalClasses = useStylesModal();
  const despatchID = props.match.params.id;

  useEffect(() => {
    fetchProducts();
    fetchDespatch();
  }, [despatchID]);

  const fetchDespatch = async () => {
    setLoading(true);
    const retrievedDespatch = await getDespatchById(despatchID);
    console.log("retrievedDespatch", retrievedDespatch);
    const georoute = await fetchGeoruta(retrievedDespatch.georuta_id);
    setGeoroutes([
      { ...georoute, label: georoute.nombre, value: georoute.georuta_id }
    ]);
    setDespatch({
      num_despa: retrievedDespatch.despatch_number,
      date: moment(retrievedDespatch.date).toDate(),
      georoute: {
        ...georoute,
        label: georoute.nombre,
        value: georoute.georuta_id
      },
      products: retrievedDespatch.detail.map(detail => ({
        total: detail.order_amount,
        codigo: detail.codigo,
        name: detail.descripcion,
        aditionalAmount: detail.aditional_amount,
        producto_id: detail.producto_id
      }))
    });
    setLoading(false);
  };

  const fetchProducts = async () => {
    const retrievedProducts = await getProducts("50", "", "");
    setProducts(
      formatToSelectOption(retrievedProducts, "producto_id", "descripcion")
    );
  };

  const fetchGeoruta = async georutaId => {
    const georuta = await getDeliveryRouteById(georutaId);
    return georuta;
  };

  const onSearchProducts = async searchText => {
    const retrievedProducts = await getProducts("50", "", searchText);
    const formatedProducts = formatToSelectOption(
      retrievedProducts,
      "producto_id",
      "descripcion"
    );
    return formatedProducts;
  };

  const onChangeDate = async value => {
    setLoading(true);
    await fetchGeoroutes(value);
    setDespatch({ date: value, products: [] });
    setLoading(false);
  };

  const onSelectGeoruta = async georoute => {
    setLoading(true);
    const products = await getDeliveryRouteProducts(georoute.georuta_id);
    setDespatch({
      ...despatch,
      georoute,
      products: products.map(product => ({ ...product, aditionalAmount: 0 }))
    });
    setLoading(false);
  };

  const fetchGeoroutes = async date => {
    const formatedDate = moment(date).format("YYYY-MM-DD");
    const retrievedGeoroutes = await getDeliveryRoutes(
      "100",
      "0",
      "",
      formatedDate
    );
    const data = formatToSelectOption(
      retrievedGeoroutes.georutas,
      "georuta_id",
      "nombre"
    );
    setGeoroutes(data);
  };

  const validateFields = async () => {
    if (!despatch.products.length === 0) {
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
      return true;
    }
    if (
      despatch.products.some(
        product => +product.aditionalAmount + +product.total === 0
      )
    ) {
      setNotification({
        color: "danger",
        text: "Error! hay un producto que no tiene carga",
        open: true
      });
      setTimeout(function() {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
    }
    return false;
  };

  const editDespatch = async () => {
    const formErrors = await validateFields();
    if (!formErrors) {
      setLoading(true);
      const updated = await updateDespatch({
        despatch_id: despatchID,
        num_despa: despatch.num_despa,
        estado: "A",
        date: moment.utc(despatch.georoute.fecha).format("YYYY-MM-DD"),
        georuta_id: despatch.georoute.georuta_id,
        detail: despatch.products.map(product => ({
          order_amount: product.total,
          aditional_amount: product.aditionalAmount ?? 0,
          producto_id: product.producto_id,
          from_order: true,
          total: (+product.aditionalAmount ?? 0) + +product.total
        }))
      });
      if (updated) {
        setNotification({
          color: "info",
          text: "Exito, despacho actualizado.",
          open: true
        });
        setTimeout(() => {
          setNotification({
            ...notification,
            open: false
          });
        }, 5000);
      }
      setLoading(false);
    }
  };

  const onChangeAditionalAmount = (productId, value) => {
    setDespatch({
      ...despatch,
      products: despatch.products.map(product => {
        if (product.producto_id === productId) {
          return { ...product, aditionalAmount: +value };
        }
        return product;
      })
    });
  };

  const aditionalAmount = product => {
    return (
      <CustomInput
        labelText=""
        id="aditional"
        inputProps={{
          type: "number"
        }}
        value={product?.aditionalAmount ?? 0}
        onChange={e =>
          onChangeAditionalAmount(product.producto_id, e.target.value)
        }
        formControlProps={{
          fullWidth: true
        }}
      />
    );
  };

  const addAditionalProducts = product => {
    const despatchProducts = [...despatch.products];
    despatchProducts.push({
      producto_id: product.producto_id,
      name: product.descripcion,
      codigo: product.codigo,
      total: 0,
      aditionalAmount: 0
    });
    setDespatch({
      ...despatch,
      products: despatchProducts
    });
    setShowAdd(false);
  };

  const onSelectProduct = product => {
    if (
      despatch.products.some(item => item.producto_id === product.producto_id)
    ) {
      setNotification({
        color: "warning",
        text:
          "Ya existe este producto en la lista de despacho, seleccione otro.",
        open: true
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          open: false
        });
      }, 10000);
      return;
    }
    setProductSelected(product);
  };

  const removeProduct = productId => {
    setDespatch({
      ...despatch,
      products: despatch.products.filter(
        product => product.producto_id !== productId
      )
    });
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Editar <b>Despacho</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button color="primary" id="addClientBtn" onClick={editDespatch}>
                <Add /> Editar Despacho
              </Button>
              <Button
                color="rose"
                id="addClientBtn"
                onClick={() => props.history.push("/mantenimiento/despacho")}
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
                <h4 className={classes.cardIconTitle}>Datos seleccionados</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <GridContainer>
                    <GridItem md={6}>
                      <CustomDatePicker
                        placeholder="Fecha"
                        value={despatch?.date}
                        onChange={onChangeDate}
                        disabled
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Ruta de entrega"
                        options={georoutes}
                        onChange={onSelectGeoruta}
                        value={despatch?.georoute}
                        disabled
                      />
                    </GridItem>
                  </GridContainer>
                  <hr />
                  <GridContainer>
                    <GridItem md={9}>
                      <h4 className={classes.cardIconTitle}>
                        Productos asignados al despacho del pedido
                      </h4>
                    </GridItem>
                    <GridItem md={3}>
                      <div className={classes.buttonContainer}>
                        <Button
                          color="primary"
                          className={classes.actionButton}
                          onClick={() => setShowAdd(true)}
                          disabled={!despatch?.georoute}
                        >
                          Agregar carga adicional
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                  <CustomTable
                    data={
                      despatch?.products.map(product => {
                        return [
                          product.codigo,
                          product.name,
                          product.total,
                          aditionalAmount(product),
                          (product.aditionalAmount ?? 0) + +product.total,
                          +product.total === 0 ? (
                            <Tooltip
                              id="tooltip-top"
                              title="Eliminar producto del despacho"
                              placement="top"
                              classes={{ tooltip: classes.tooltip }}
                            >
                              <Button
                                color="danger"
                                className={classes.actionButton}
                                onClick={() =>
                                  removeProduct(product.producto_id)
                                }
                              >
                                <Close />
                              </Button>
                            </Tooltip>
                          ) : (
                            <></>
                          )
                        ];
                      }) ?? []
                    }
                    limite={10}
                    headers={[
                      "Código",
                      "Nombre",
                      "Carga del pedido",
                      "Carga adicional",
                      "Total",
                      "Acciones"
                    ]}
                    showSearch={false}
                  />
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
        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={showAdd}
          transition={Transition}
          keepMounted
          onClose={() => setShowAdd(false)}
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
              Agregar producto al despacho
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <AsyncSelector
              placeholder="Producto"
              options={retrievedProducts}
              onChange={onSelectProduct}
              value={productSelected}
              loadOptions={onSearchProducts}
            />
            <br />
            <br />
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              color="primary"
              onClick={() => addAditionalProducts(productSelected)}
            >
              Agregar
            </Button>
            <Button
              onClick={() => {
                setShowAdd(false);
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
