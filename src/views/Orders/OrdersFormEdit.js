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
import {
  getClientByID,
  getClients,
  updateClientComment
} from "../../services/Clients";
import {
  editOrder,
  getOrdeDetailById,
  getOrderById
} from "../../services/Orders";
import moment from "moment";
import { ORIGIN_ORDER_LIST } from "helpers/constants";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";
import { PAYMENT_LIST } from "helpers/constants";
import LoaderComponent from "components/Loader/Loader";

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

export default function OrdersFormEdit(props) {
  const orderID = props.match.params.id;
  const [order, setOrder] = useState({});
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [totalOrder, setTotalOrder] = useState(0);
  const [editProduct, setEditProduct] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
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
    fetchClients();
  }, []);

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
    setLoading(true);
    const retrievedOrder = await getOrderById(orderID);
    const client = await getClientByID(retrievedOrder.cliente_id);
    const orderDetail = await getOrdeDetailById(orderID);
    const date = moment.utc(retrievedOrder.fecha_entrega);
    const year = date.format("YYYY");
    const month = date.format("MM");
    const day = date.format("DD");
    const minute = date.format("mm");
    const hour = date.format("HH");
    const deliveryDate = new Date([year, month, day]);
    deliveryDate.setHours(hour, minute, 0, 0);
    setOrder({
      order_id: retrievedOrder.pedido_id,
      fecha_entrega: deliveryDate,
      comentario: client.contacto,
      formapago_id: PAYMENT_LIST.find(
        payment => payment.value === retrievedOrder.formapago_id
      ),
      georuta_id: "",
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
        cantidad: detail.d_cantidad,
        price: {
          precio: detail.d_total / detail.d_cantidad,
          precio_id: detail.price_precio_id
        },
        product: {
          codigo: detail.product_codigo,
          descripcion: detail.product_descripcion,
          unidades: detail.product_unidades,
          total: detail.d_total,
          tipo_venta: detail.d_tipo_venta,
          producto_id: detail.product_producto_id,
          value: detail.product_producto_id,
          label: detail.product_descripcion
        }
      }))
    });
    setLoading(false);
  };

  const fetchClients = async () => {
    const retrievedClients = await getClients("50", "", "");
    setClients(
      formatToSelectOption(retrievedClients.clients, "cliente_id", "nombre")
    );
  };

  const fetchProductPrice = async () => {
    if (order.client && productSelected.product) {
      const productPrice = await getProductPrice(
        productSelected.product.producto_id,
        order.client.sucursal_id,
        order.client.cliente_id
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

  const validateBottles = (max = 500, value = 0, edit = false) => {
    let maxAllowed = max - 1;
    if (max > 1) {
      maxAllowed = max;
    }
    if (max === 1) {
      maxAllowed = 500;
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

  const updateClientContact = async () => {
    const selectedPayment = PAYMENT_LIST.find(
      payment => payment.value === order.client.formapago_id
    );
    if (
      order.client.contacto !== order.comentario ||
      selectedPayment !== order.client.formapago_id
    ) {
      await updateClientComment(
        order.client.cliente_id,
        order.comentario,
        order.client.formapago_id
      );
    }
  };

  const editCreatedOrder = async () => {
    setLoading(true);
    const formData = new FormData();
    const orderToUpdate = {
      empresa_id: order.client.empresa_id,
      sucursal_id: order.client.sucursal_id,
      semana: moment().week(),
      fecha_entrega: moment(order.fecha_entrega).format("YYYY-MM-DD HH:mm:ss"),
      cliente_id: order.client.cliente_id,
      origen: order.origin.value,
      total: totalOrder,
      estado_pedido: "creado",
      formapago_id: order.formapago_id.value,
      creado_desde: "web",
      estado: "A",
      comentario: "",
      georuta_id: order.georuta_id,
      detail: JSON.stringify(
        order.products.map(product => ({
          price_id: product.price.precio_id,
          cantidad: product.cantidad ?? 0,
          tipo_venta: "01",
          descuento: 0,
          total: calculateTotalPerProduct(product),
          producto_id: product.product.producto_id
        }))
      ),
      userId: getUserId()
    };
    Object.keys(orderToUpdate).map(orderField => {
      console.log(orderField, orderToUpdate[orderField]);
      formData.append(orderField, orderToUpdate[orderField]);
    });
    if (order?.prepago_imagen) {
      formData.append("file", order.prepago_imagen);
    }
    await editOrder(formData, orderID);
    updateClientContact();
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
    setLoading(false);
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

  const onSelectClient = client => {
    if (!client.point) {
      setNotification({
        color: "warning",
        text:
          "El cliente no tiene georeferencia, por favor actualice su ubicación en el mapa antes de crear el pedido.",
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
    const selectedPayment = PAYMENT_LIST.find(
      payment => payment.value === client.formapago_id
    );
    const orderData = {
      ...order,
      client,
      formapago_id: selectedPayment,
      comentario: client.contacto
    };
    setOrder(orderData);
  };

  console.log("productSElected", productSelected);

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
                        onChange={onSelectClient}
                        value={order.client}
                        loadOptions={onSearchClients}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomInput
                        labelText="Dirección de cliente"
                        id="address"
                        inputProps={{
                          type: "text"
                        }}
                        value={order?.client?.direccion ?? ""}
                        formControlProps={{
                          fullWidth: true
                        }}
                        disabled
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
                        placeholder="Tipo de pago"
                        options={PAYMENT_LIST}
                        onChange={value => handleForm("formapago_id", value)}
                        value={order?.formapago_id}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomDatePicker
                        placeholder="Fecha de entrega"
                        value={order?.fecha_entrega}
                        onChange={date => handleForm("fecha_entrega", date)}
                        minDate={new Date()}
                        showTimeSelect
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <div className="margin-top">
                        <CustomInput
                          labelText="Comentario"
                          id="comment"
                          inputProps={{
                            type: "text"
                          }}
                          value={order?.comentario}
                          onChange={e =>
                            handleForm("comentario", e.target.value)
                          }
                          formControlProps={{
                            fullWidth: true
                          }}
                        />
                      </div>
                    </GridItem>
                    {order?.formapago_id?.value === "03" && (
                      <GridItem md={6}>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          <Button color="rose" key="AddButton1">
                            <label htmlFor="files" style={{ color: "white" }}>
                              Selecciona la imagen del prepago
                            </label>
                          </Button>
                          <p style={{ marginLeft: "1rem" }}>
                            {order?.prepago_imagen?.name ?? ""}
                          </p>
                          <input
                            type="file"
                            onChange={e =>
                              handleForm("prepago_imagen", e.target.files[0])
                            }
                            id="files"
                            style={{ visibility: "hidden" }}
                            accept="image/*"
                          />
                        </div>
                      </GridItem>
                    )}
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
                            product.cantidad ? product.cantidad : 0,
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
                onChange={e => validateBottles(500, e.target.value)}
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
