import React, { useEffect, useState } from "react";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
// Components
import { makeStyles } from "@material-ui/core/styles";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomTable from "components/Table/CustomTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Loader from "components/Loader/Loader.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
// Modal
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import TableStyles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import AdminLayout from "../../layouts/Admin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Modalstyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import { Edit } from "@material-ui/icons";
import { deleteOrder } from "services/Orders";
import { getOrders } from "services/Orders";
import moment from "moment";

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
const useTableStyles = makeStyles(TableStyles);
const useStylesModal = makeStyles(Modalstyles);

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Pedidos(props) {
  const classes = useStyles();
  const classesTable = useTableStyles();
  const modalClasses = useStylesModal();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState({ orders: [], total: 0 });
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState({});
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showClient, setShowClient] = useState(false);
  const [client, setClient] = useState({});
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });

  useEffect(() => {
    fetchOrders(offset, limit, search);
    // eslint-disable-next-line react/prop-types
  }, [props.history, offset, limit, search]);

  const fetchOrders = async (offsetFetch, limitFetch, searchFetch) => {
    const ordersRetrieved = await getOrders(
      limitFetch,
      offsetFetch,
      searchFetch
    );
    setOrders({ orders: ordersRetrieved.orders });
    setTotal(ordersRetrieved.total);
  };

  const fillButtons = order => {
    return [
      { color: "rose", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={
            prop.color === "danger" ? "Eliminar pedido" : "Ver / Editar pedido"
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
                setOrder(order);
                setShowDelete(true);
              } else {
                props.history.push(
                  "/mantenimiento/pedidos/editar/" + order.pedido_id
                );
              }
            }}
          >
            <prop.icon className={classesTable.icon} />
          </Button>
        </Tooltip>
      );
    });
  };

  const clientInfo = order => (
    <Tooltip
      id="tooltip-top"
      title="Ver cliente"
      placement="left-start"
      classes={{ tooltip: classes.tooltip }}
    >
      <a onClick={() => showClientInfo(order?.cliente_id)}>{order?.nombre}</a>
    </Tooltip>
  );

  const showClientInfo = cliente_id => {
    getClient(cliente_id);
    setShowClient(true);
  };

  const getClient = cliente_id => {
    setLoading(true);
    Axios.get(`/clients/${cliente_id}`)
      .then(response => {
        setClient(response.data);
      })
      .catch(e => {
        console.error(e);
        if (e.request.status === 403) {
          // eslint-disable-next-line react/prop-types
          props.history.push("/login");
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteCurrentOrder = async () => {
    await deleteOrder(order.pedido_id);
    await fetchOrders(offset, limit, search);
    setNotification({
      color: "info",
      text: "Exito! Pedido eliminado.",
      open: true
    });
    setTimeout(function() {
      setNotification({
        ...notification,
        open: false
      });
    }, 6000);
    setShowDelete(false);
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Administración de <b>Pedidos.</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                key="AddButton1"
                onClick={() =>
                  // eslint-disable-next-line react/prop-types
                  props.history.push("/mantenimiento/pedidos/crear")
                }
              >
                <Add /> Agregar Pedido
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
                <h4 className={classes.cardIconTitle}>Pedidos registrados</h4>
              </CardHeader>
              <CardBody>
                <CustomTable
                  data={orders?.orders?.map(order => {
                    return [
                      order?.num_pedido,
                      order.semana,
                      moment.utc(order?.fecha_pedido).format("DD-MM-YYYY"),
                      moment.utc(order?.fecha_entrega).format("DD-MM-YYYY"),
                      clientInfo(order),
                      order?.origen,
                      "$" + order?.total,
                      fillButtons(order)
                    ];
                  })}
                  limite={10}
                  headers={[
                    "N°",
                    "Semana",
                    "Fecha de pedido",
                    "Fecha de entrega",
                    "Cliente",
                    "Origen",
                    "Total",
                    "Acciones"
                  ]}
                  limit={limit}
                  onOffsetChange={valueOffset => {
                    setOffset(valueOffset);
                  }}
                  total={total}
                  changeLimit={limite => {
                    setLimit(limite);
                  }}
                  offset={offset}
                  onSearchChange={searchValue => {
                    setSearch(searchValue);
                  }}
                  searchValue={search}
                  showSearch={true}
                  placeholderSearch={"Ejemplo: EDUARDO LOPEZ O 172405872"}
                  labelSearch={"Nombre de cliente o RUC/CI a buscar"}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        {loading && <Loader show={loading} />}
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
          open={showClient}
          transition={Transition}
          keepMounted
          onClose={() => setShowClient(false)}
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
            <h3 className={modalClasses.modalTitle}>Información del cliente</h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <CustomInput
              labelText="Nombre"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.nombre}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
            <CustomInput
              labelText="Razon social"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.razon_social}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
            <CustomInput
              labelText="RUC/CI"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.ruc_cedula}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
            <CustomInput
              labelText="Telefono"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.telefono ?? "--"}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
            <CustomInput
              labelText="Email"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.correo_elec ?? "--"}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
            <CustomInput
              labelText="Direccion"
              id="boxes"
              inputProps={{
                type: "text"
              }}
              value={client?.direccion}
              formControlProps={{
                fullWidth: true
              }}
              disabled
            />
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button
              onClick={() => {
                setShowClient(false);
                setClient({});
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
          open={showDelete}
          transition={Transition}
          keepMounted
          onClose={() => setShowDelete(false)}
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
              Eliminar pedido <b>#{order.num_pedido}</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={modalClasses.modalBody}
          >
            <h4>
              Esta seguro que desea <b>eliminar</b> el pedido?
            </h4>
          </DialogContent>
          <DialogActions
            className={
              modalClasses.modalFooter + " " + modalClasses.modalFooterCenter
            }
          >
            <Button color="danger" onClick={deleteCurrentOrder}>
              Eliminar
            </Button>
            <Button
              onClick={() => {
                setShowDelete(false);
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
