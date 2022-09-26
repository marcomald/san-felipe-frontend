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
import { getClients } from "../../services/Clients";
import { createOrder, getOrderById } from "../../services/Orders";
import moment from "moment";
import { ORIGIN_ORDER_LIST } from "helpers/constants";
import { PAYMENT_LIST } from "helpers/constants";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";

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

export default function OrdersForm(props) {
  const orderID = props.match.params.id;
  const [order, setOrder] = useState({});
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [territory, setTerritory] = useState({});
  const [productSelected, setProductSelected] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    if (orderID) {
      fetchOrder();
    }
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
    if (order.products && order.products) {
      calculateTotalOrder(order.products);
    }
  }, [order.products]);

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

  const onEditProduct = () => {
    const products = order.products.map(product => {
      if (product.product.producto_id === editProduct.product.producto_id) {
        return { ...product, cantidad: editProduct.cantidad };
      }
      return product;
    });
    handleForm("products", products);
    setShowEditModal(false);
    setEditProduct({});
  };

  const calculateTotalOrder = products => {
    let total = 0;
    products.forEach(product => {
      total += +calculateTotalPerProduct(product);
    });
    setTotalOrder(total.toFixed(2));
  };

  const calculateTotalPerProduct = product => {
    const price = product?.price?.precio;
    const total = product?.cantidad * price;
    return total.toFixed(2);
  };

  const validateOrder = () => {
    if (!order?.client) return false;
    if (!order?.products || order?.products?.length === 0) return false;
    if (!order?.origin) return false;
    if (!order?.formapago_id) return false;
    if (!order?.fecha_entrega) return false;
    return true;
  };

  const fillButtons = product => {
    return [
      { color: "rose", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger" ? "Eliminar producto" : "Editar producto"
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
              if (prop.color === "danger") {
                removeProduct(product);
                return;
              }
              setShowEditModal(true);
              setEditProduct(product);
            }}
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

  const onSelectProduct = product => {
    if (order.products) {
      const productAlredyAdded = order.products.some(
        item => item.product.producto_id === product.producto_id
      );
      if (productAlredyAdded) {
        setNotification({
          color: "warning",
          text:
            "El producto ya ha sido agregado en el pedido, seleccione otro por favor.",
          open: true
        });
        setTimeout(() => {
          setNotification({
            ...notification,
            open: false
          });
        }, 7000);
        return;
      }
    }
    handleOrderProductsForm("product", product);
  };

  const validateBottles = (max = 50, value = 0, edit = false) => {
    let maxAllowed = max - 1;
    if (max > 1) {
      maxAllowed = max;
    }
    if (max === 1) {
      maxAllowed = 50;
    }
    if (edit) {
      setEditProduct({ ...editProduct, cantidad: +value });
      return;
    }
    if (+maxAllowed >= +value && +value >= 0) {
      handleOrderProductsForm("cantidad", +value);
    }
  };

  const fetchProducts = async () => {
    const retrievedProducts = await getProducts("50", "", "");
    setProducts(
      formatToSelectOption(retrievedProducts, "producto_id", "descripcion")
    );
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

  const createNewOrder = async () => {
    await createOrder([
      {
        empresa_id: order.client.empresa_id,
        sucursal_id: order.client.sucursal_id,
        semana: moment().week(),
        fecha_pedido: moment().format("YYYY-MM-DD HH:mm:ss"),
        cliente_id: order.client.cliente_id,
        origen: order.origin.value,
        fecha_entrega: order.fecha_entrega,
        total: totalOrder,
        estado_pedido: "Creado",
        formapago_id: order.formapago_id.value,
        tipo_pago: "transferencia",
        creado_desde: "web",
        estado: "A",
        comentario: "",
        detail: order.products.map(product => ({
          price_id: product.price.precio_id,
          cantidad: product.cantidad ?? 0,
          tipo_venta: "01",
          descuento: 0,
          total: calculateTotalPerProduct(product),
          producto_id: product.product.producto_id
        })),
        userId: getUserId()
      }
    ]);
    setOrder({});
    setNotification({
      color: "info",
      text: "Exito, pedido creado.",
      open: true
    });
    setTimeout(() => {
      setNotification({
        ...notification,
        open: false
      });
    }, 10000);
  };

  const onSelectClient = client => {
    const selectedPayment = PAYMENT_LIST.find(
      payment => payment.value === client.formapago_id
    );
    setOrder({ ...order, client, formapago_id: selectedPayment });
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
                color="primary"
                id="addClientBtn"
                onClick={() => props.history.push("/mantenimiento/pedidos")}
              >
                Regresar
              </Button>
              <Button
                color="rose"
                disabled={!validateOrder()}
                onClick={createNewOrder}
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
                      <AsyncSelector
                        placeholder="Cliente"
                        options={clients}
                        onChange={onSelectClient}
                        value={order.client}
                        loadOptions={onSearchClients}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Origen"
                        options={ORIGIN_ORDER_LIST}
                        onChange={value => handleForm("origin", value)}
                        value={order.origin}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Forma de pago"
                        options={PAYMENT_LIST}
                        onChange={value => handleForm("formapago_id", value)}
                        value={order?.formapago_id}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomDatePicker
                        placeholder="Fecha de entrega"
                        value={order?.fecha_entrega ?? new Date()}
                        onChange={date => handleForm("fecha_entrega", date)}
                        minDate={new Date()}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <br />
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
                  <br />
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
                <GridContainer>
                  <GridItem xs={8}>
                    <h4 className={classes.cardIconTitle}>
                      Productos agregados
                    </h4>
                  </GridItem>
                  <GridItem xs={4}>
                    <h4 className={classes.cardIconTitle + " align-right"}>
                      <b>TOTAL: </b>${totalOrder}
                    </h4>
                  </GridItem>
                </GridContainer>
              </CardHeader>
              <CardBody>
                <CustomTable
                  data={
                    order.products
                      ? order.products.map(product => {
                          return [
                            product?.product?.codigo,
                            product?.product?.descripcion,
                            product?.cantidad ?? 0,
                            `$${product?.price?.precio ?? 0}`,
                            0,
                            `$${calculateTotalPerProduct(product)}`,
                            fillButtons(product)
                          ];
                        })
                      : []
                  }
                  limite={20}
                  headers={[
                    "Código",
                    "Nombre",
                    "Cantidad",
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
                onChange={onSelectProduct}
                value={productSelected?.product}
                loadOptions={onSearchProducts}
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
                labelText="Cantidad"
                id="amount"
                inputProps={{
                  type: "number"
                }}
                value={productSelected?.cantidad ?? 0}
                onChange={e => validateBottles(50, e.target.value)}
                formControlProps={{
                  fullWidth: true
                }}
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
                (productSelected?.cantidad ? productSelected?.cantidad : 0) <= 0
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

        <Dialog
          classes={{
            root: modalClasses.center,
            paper: modalClasses.modal
          }}
          open={showEditModal}
          transition={Transition}
          keepMounted
          onClose={() => setShowEditModal(false)}
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
              Editar producto de tu pedido
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
                value={editProduct?.product}
                loadOptions={onSearchProducts}
                disabled
              />
              <CustomInput
                labelText="Precio"
                id="boxes"
                inputProps={{
                  type: "number"
                }}
                value={editProduct?.price?.precio ?? 0}
                formControlProps={{
                  fullWidth: true
                }}
                disabled
              />
              <CustomInput
                labelText="Cantidad"
                id="amount"
                inputProps={{
                  type: "number"
                }}
                value={editProduct?.cantidad ?? 0}
                onChange={e => validateBottles(50, e.target.value, true)}
                formControlProps={{
                  fullWidth: true
                }}
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
              onClick={onEditProduct}
              disabled={
                !editProduct.product ||
                (editProduct?.cantidad ? editProduct?.cantidad : 0) <= 0
              }
            >
              Editar Producto
            </Button>
            <Button
              onClick={() => {
                setShowEditModal(false);
                setEditProduct({});
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
