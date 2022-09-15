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
import {
  Add,
  Close,
  Edit,
  FormatListBulleted,
  ShoppingCart
} from "@material-ui/icons";
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
import Axios from "axios";
import Selector from "components/CustomDropdown/CustomSelector";
import Button from "components/CustomButtons/Button.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import CustomTable from "components/Table/CustomTable.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { getUserId } from "helpers/utils";
import Loader from "components/Loader/Loader.js";
import Snackbar from "components/Snackbar/Snackbar";
import { getProductPrice, getProducts } from "../../services/Products";
import { formatToSelectOption } from "../../helpers/utils";
import { getTerritory } from "../../services/Territory";
import { getClients } from "../../services/Clients";
import { getOrderById } from "../../services/Orders";

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
const useTableStyles = makeStyles(TableStyles);

const OriginList = [
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter" },
  { value: "Llamada telefonica", label: "Llamada telefonica" }
];

export default function OrdersForm(props) {
  const orderID = props.match.params.id;
  const [order, setOrder] = useState({});
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [territory, setTerritory] = useState({});
  const [productSelected, setProductSelected] = useState({});
  const [searchClients, setSearchClients] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();
  const modalClasses = useStylesModal();
  const classesTable = useTableStyles();

  useEffect(() => {
    fetchProducts();
    if (orderID) {
      fetchOrder();
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [searchClients]);

  useEffect(() => {
    fetchProducts();
  }, [searchProducts]);

  useEffect(() => {
    if (order.client) {
      fetchTerritory();
    }
  }, [order.client]);

  useEffect(() => {
    if (productSelected.product) {
      fetchProductPrice();
    }
  }, [productSelected.product]);

  const handleForm = (key, value) => {
    const updatedOrder = { ...order };
    updatedOrder[key] = value;
    setOrder(updatedOrder);
  };

  const handleOrderProductsForm = (key, value) => {
    const product = { ...productSelected };
    product[key] = value;
    setProductSelected(product);
  };

  const removeProduct = productToRemove => {
    const productsUpdated = order.products.filter(
      product =>
        product.product.producto_id !== productToRemove.product.producto_id
    );
    handleForm("products", productsUpdated);
  };

  const addProduct = () => {
    let products = [productSelected];
    if (order.products) {
      products = [...order.products, productSelected];
    }
    handleForm("products", products);
    setProductSelected({});
  };

  const calculateTotalPerProduct = product => {
    const price = product?.price?.precio;
    const boxes = product?.boxes ? +product.boxes : 0;
    const bottles = product?.bottles ? +product.bottles : 0;
    const bottlesPrice = bottles * price;
    const boxesPrice = boxes * price * productSelected?.product?.unidades;
    return (bottlesPrice + boxesPrice).toFixed(2);
  };

  const validateOrder = () => {
    if (!order?.client) return false;
    if (!order?.products || order?.products?.length === 0) return false;
    if (!order?.origin) return false;
    return true;
  };

  const fillButtons = product => {
    return [
      { color: "info", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger" ? "Eliminar producto" : "Editar productos"
          }
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classesTable.actionButton}
            key={key}
            onClick={() =>
              prop.color === "danger"
                ? removeProduct(product)
                : setShowModal(true)
            }
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const fetchOrder = async () => {
    const retrievedOrder = await getOrderById(orderID);
    setOrder({
      order_id: retrievedOrder.pedido_id,
      origin: {
        value: retrievedOrder.origen,
        label: retrievedOrder.origen
      }
    });
  };

  const fetchClients = async () => {
    const retrievedClients = await getClients("30", "", searchClients);
    setClients(
      formatToSelectOption(retrievedClients.clients, "cliente_id", "nombre")
    );
  };

  const fetchTerritory = async () => {
    if (order.client) {
      const territoryRetrieved = await getTerritory(order.client.territorio_id);
      setTerritory(territoryRetrieved);
    }
  };

  const fetchProductPrice = async () => {
    if (order.client && productSelected.product) {
      const productPrice = await getProductPrice(
        productSelected.product.producto_id,
        order.client.sucursal_id,
        order.client.listapre_id ?? "02"
      );
      handleOrderProductsForm("price", productPrice);
    }
  };

  const validateBottles = (max = 50, value = 0) => {
    if (+max >= +value && +value >= 0) {
      handleOrderProductsForm("bottles", value);
    }
  };

  const fetchProducts = async () => {
    const retrievedProducts = await getProducts("10", "", searchProducts);
    setProducts(
      formatToSelectOption(retrievedProducts, "producto_id", "descripcion")
    );
  };

  const createOrder = () => {
    Axios.post("/orders", [
      {
        empresa_id: order.client.empresa_id,
        sucursal_id: order.client.sucursal_id,
        semana: 12,
        fecha_pedido: "2022-06-19 00:00:00",
        cliente_id: order.client.cliente_id,
        origen: order.origin.value,
        fecha_entrega: "2022-06-19 00:00:00",
        tipo_pago: "transferencia",
        estado: "A",
        comentario: "",
        detail: order.products.map(product => ({
          price_id: product.price.precio_id,
          cant_cajas: product.boxes,
          cant_botellas: product.bottles,
          tipo_venta: "01",
          descuento: 0,
          total: calculateTotalPerProduct(product)
        })),
        userId: getUserId()
      }
    ])
      .then(async response => {
        const result = await response.data;
        setLoading(false);
        if (result.errors) {
          setNotification({
            color: "danger",
            text: "Error! Al crear pedido.",
            open: true
          });
          setTimeout(function() {
            setNotification({
              ...notification,
              open: false
            });
          }, 10000);
        } else {
          setNotification({
            color: "info",
            text: "Exito! Pedido creado.",
            open: true
          });
          setTimeout(function() {
            setNotification({
              ...notification,
              open: false
            });
          }, 6000);
        }
      })
      .catch(err => {
        console.error("Error al crear pedido: ", err);
        if (err.request.status === 403) {
          props.history.push("/login");
          return;
        }
        setNotification({
          color: "danger",
          text: "Error! Al crear peido.",
          open: true
        });
        setTimeout(function() {
          setNotification({
            ...notification,
            open: false
          });
        }, 10000);
      });
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Agregar nuevo <b>Pedido</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="rose"
                disabled={!validateOrder()}
                onClick={createOrder}
              >
                <Add /> Crear Pedido
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <ShoppingCart />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Ingrese los siguientes datos
                </h4>
              </CardHeader>
              <CardBody>
                <form>
                  <GridContainer>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Cliente"
                        options={clients}
                        onChange={value => handleForm("client", value)}
                        value={order.client}
                        onInputChange={text => setSearchClients(text)}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Origen"
                        options={OriginList}
                        onChange={value => handleForm("origin", value)}
                        value={order.origin}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Ruta"
                        id="rute"
                        inputProps={{
                          type: "text"
                        }}
                        value={territory?.descripcion}
                        onChange={e => handleForm("origin", e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
                      />
                    </GridItem>
                  </GridContainer>
                  <Button
                    color="primary"
                    key="AddButton1"
                    onClick={() => setShowModal(true)}
                    disabled={!order.client}
                  >
                    <Add /> Agregar Productos
                  </Button>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <br />
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <FormatListBulleted />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Productos agregados</h4>
              </CardHeader>
              <CardBody>
                <CustomTable
                  data={
                    order.products
                      ? order.products.map(product => {
                          return [
                            product?.product?.codigo,
                            product?.product?.descripcion,
                            "01",
                            product?.boxes ?? 0,
                            product?.bottles ?? 0,
                            `$${product?.price?.precio ?? 0}`,
                            0,
                            `$${calculateTotalPerProduct(product)}`,
                            fillButtons(product)
                          ];
                        })
                      : []
                  }
                  limite={10}
                  headers={[
                    "Código",
                    "Nombre",
                    "Tipo venta",
                    "Cajas",
                    "Botellas",
                    "Precio",
                    "Descuento",
                    "Total",
                    "Acción"
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        {loading && <Loader show={loading} />}
        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={showModal}
          transition={Transition}
          keepMounted
          onClose={() => setShowModal(false)}
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
              Agrega un producto a tu pedido
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <form>
              <Selector
                placeholder="Producto"
                options={products}
                onChange={value => handleOrderProductsForm("product", value)}
                value={productSelected?.product}
                onInputChange={setSearchProducts}
              />
              <CustomInput
                labelText="Precio"
                id="boxes"
                inputProps={{
                  type: "number"
                }}
                value={productSelected?.price?.precio ?? 0}
                formControlProps={{
                  fullWidth: true
                }}
                disabled
              />
              <CustomInput
                labelText="Cajas"
                id="boxes"
                inputProps={{
                  type: "number"
                }}
                value={productSelected?.boxes}
                onChange={e => handleOrderProductsForm("boxes", e.target.value)}
                formControlProps={{
                  fullWidth: true
                }}
                disabled={
                  productSelected?.bottles > 0 ||
                  productSelected?.product?.unidades === 1
                }
              />
              <CustomInput
                labelText="Botellas"
                id="bottles"
                inputProps={{
                  type: "number"
                }}
                value={productSelected?.bottles ?? 0}
                onChange={e =>
                  validateBottles(
                    productSelected?.product?.unidades,
                    e.target.value
                  )
                }
                formControlProps={{
                  fullWidth: true
                }}
                disabled={productSelected?.boxes > 0}
              />
            </form>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              color="info"
              onClick={addProduct}
              disabled={
                !productSelected.product ||
                (productSelected?.boxes ? +productSelected?.boxes : 0) +
                  (productSelected?.bottles ? +productSelected?.bottles : 0) <=
                  0
              }
            >
              Agregar Producto
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
                setProductSelected({});
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
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
