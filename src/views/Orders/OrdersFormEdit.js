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
  FormatListBulleted,
  ShoppingCart,
  Edit
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
import Selector from "components/CustomDropdown/CustomSelector";
import AsyncSelector from "components/CustomDropdown/CustomAsyncSelector";
import Button from "components/CustomButtons/Button.js";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import CustomTable from "components/Table/CustomTable.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { getUserId } from "helpers/utils";
import Snackbar from "components/Snackbar/Snackbar";
import { getProductPrice, getProducts } from "../../services/Products";
import { formatToSelectOption } from "../../helpers/utils";
import { getTerritory } from "../../services/Territory";
import { getClientByID, getClients } from "../../services/Clients";
import {
  editOrder,
  getOrdeDetailById,
  getOrderById
} from "../../services/Orders";
import moment from "moment";

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

export default function OrdersFormEdit(props) {
  const orderID = props.match.params.id;
  const [order, setOrder] = useState({});
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [territory, setTerritory] = useState({});
  const [productSelected, setProductSelected] = useState({});
  const [showModal, setShowModal] = useState(false);
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
    fetchClients();
  }, []);

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

  useEffect(() => {
    if (orderID) {
      fetchOrder();
    }
  }, [orderID]);

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
    const bottlesPrice = (price / product?.product?.unidades) * bottles;
    const boxesPrice = boxes * price;
    return (bottlesPrice + boxesPrice).toFixed(2);
  };

  const validateOrder = () => {
    if (!order?.client) return false;
    if (!order?.products || order?.products?.length === 0) return false;
    if (!order?.origin) return false;
    return true;
  };

  const fillButtons = product => {
    return [{ color: "danger", icon: Close }].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title="Eliminar producto"
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classesTable.actionButton}
            key={key}
            onClick={() => removeProduct(product)}
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const fetchOrder = async () => {
    const retrievedOrder = await getOrderById(orderID);
    const client = await getClientByID(retrievedOrder.cliente_id);
    const orderDetail = await getOrdeDetailById(orderID);
    setOrder({
      order_id: retrievedOrder.pedido_id,
      origin: {
        value: retrievedOrder.origen,
        label: retrievedOrder.origen
      },
      client: {
        ...client,
        label: client.nombre,
        value: retrievedOrder.cliente_id
      },
      products: orderDetail.map(detail => ({
        boxes: detail.d_cant_cajas,
        bottles: detail.d_cant_botellas,
        price: {
          precio: detail.price_precio,
          precio_id: detail.price_precio_id
        },
        product: {
          codigo: detail.product_codigo,
          descripcion: detail.product_descripcion,
          unidades: detail.product_unidades,
          total: detail.d_total,
          tipo_venta: detail.d_tipo_venta,
          producto_id: detail.product_producto_id
        }
      }))
    });
  };

  const fetchClients = async () => {
    const retrievedClients = await getClients("50", "", "");
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
      if (productPrice.error) {
        setNotification({
          color: "warning",
          text: productPrice.message,
          open: true
        });
        setTimeout(() => {
          setNotification({
            ...notification,
            open: false
          });
        }, 5000);
      }
      handleOrderProductsForm("price", productPrice);
    }
  };

  const validateBottles = (max = 50, value = 0) => {
    let maxAllowed = max;
    if (max > 1) {
      maxAllowed = max - 1;
    }
    if (+maxAllowed >= +value && +value >= 0) {
      handleOrderProductsForm("bottles", value);
    }
  };

  const fetchProducts = async () => {
    const retrievedProducts = await getProducts("50", "", "");
    setProducts(
      formatToSelectOption(retrievedProducts, "producto_id", "descripcion")
    );
  };

  const editCreatedOrder = async () => {
    await editOrder(
      {
        empresa_id: order.client.empresa_id,
        sucursal_id: order.client.sucursal_id,
        semana: moment().week(),
        fecha_pedido: moment().format("YYYY-MM-DD HH:mm:ss"),
        cliente_id: order.client.cliente_id,
        origen: order.origin.value,
        fecha_entrega: "2022-06-19 00:00:00",
        tipo_pago: "transferencia",
        estado: "A",
        comentario: "",
        detail: order.products.map(product => ({
          price_id: product.price.precio_id,
          cant_cajas: product.boxes ?? 0,
          cant_botellas: product.bottles ?? 0,
          tipo_venta: "01",
          descuento: 0,
          total: calculateTotalPerProduct(product),
          producto_id: product.product.producto_id
        })),
        userId: getUserId()
      },
      orderID
    );
    setNotification({
      color: "info",
      text: "Exito, pedido editado.",
      open: true
    });
    setTimeout(() => {
      setNotification({
        ...notification,
        open: false
      });
    }, 10000);
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

  const onSearchClients = async searchText => {
    const retrievedClients = await getClients("50", "", searchText);
    const formatedClients = formatToSelectOption(
      retrievedClients.clients,
      "cliente_id",
      "nombre"
    );
    return formatedClients;
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Editar <b>Pedido</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                id="addClientBtn"
                onClick={() => props.history.push("/mantenimiento/pedidos")}
              >
                Regresar
              </Button>
              <Button
                color="rose"
                disabled={!validateOrder()}
                onClick={editCreatedOrder}
              >
                <Edit /> Editar Pedido
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
                      <AsyncSelector
                        placeholder="Cliente"
                        options={clients}
                        onChange={value => handleForm("client", value)}
                        value={order.client}
                        loadOptions={onSearchClients}
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
                            product.boxes ? product.boxes : 0,
                            product.bottles ? product.bottles : 0,
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
                    "Cajas",
                    "Botellas",
                    "Precio Caja",
                    "Descuento",
                    "Total",
                    "Acción"
                  ]}
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
              <AsyncSelector
                placeholder="Producto"
                options={products}
                onChange={value => handleOrderProductsForm("product", value)}
                value={productSelected?.product}
                loadOptions={onSearchProducts}
              />
              <CustomInput
                labelText="Precio Caja"
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
                disabled={productSelected?.product?.unidades === 1}
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
                    productSelected ? productSelected?.product?.unidades : 0,
                    e.target.value
                  )
                }
                formControlProps={{
                  fullWidth: true
                }}
              />
              {productSelected &&
                productSelected.product &&
                productSelected.product.unidades && (
                  <small>
                    Máximo de botellas por pedido:{" "}
                    {productSelected.product.unidades > 1
                      ? productSelected.product.unidades - 1
                      : productSelected.product.unidades}
                  </small>
                )}
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
