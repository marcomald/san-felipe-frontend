import { AssignmentInd, Check } from "@material-ui/icons";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Snackbar from "components/Snackbar/Snackbar";
import CustomTable from "components/Table/CustomTable";
import Button from "components/CustomButtons/Button.js";
import React, { useEffect, useState } from "react";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import AdminLayout from "layouts/Admin";
import LoaderComponent from "components/Loader/Loader";
import { makeStyles } from "@material-ui/core";
import { getClosureDetail } from "services/Despatch";
import { completeClosure } from "services/Despatch";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";

const customStyles = {
  ...styles,
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  cardIconTitle: {
    ...cardTitle,
    marginBottom: "0px",
    marginRight: "1rem"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%"
  }
};
const useStyles = makeStyles(customStyles);

export const ClosureForm = props => {
  const dispatchNumber = props?.match?.params?.id;
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [money, setMoney] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const classes = useStyles();

  useEffect(() => {
    fetchDespatchDetail();
  }, [dispatchNumber]);

  const fetchDespatchDetail = async () => {
    setLoading(true);
    const despatchDetail = await getClosureDetail(dispatchNumber);
    setProducts(despatchDetail?.products);
    setMoney(despatchDetail?.collectedMoney);
    setOrders(despatchDetail?.orders);
    setLoading(false);
  };

  const isApprovePage = () => {
    const pathname = window.location.pathname;
    return pathname.includes("aprobar");
  };

  const getTotalMoney = () => {
    let total = 0;
    money.forEach(item => {
      total += +item.monto;
    });
    return total;
  };

  const getTotalProducts = () => {
    let total = 0;
    products.forEach(item => {
      total += +item?.cant_despacho - +item?.cant_entregada;
    });
    return total;
  };

  const approveClosure = async () => {
    setLoading(true);
    completeClosure(dispatchNumber);
    setLoading(false);
    setNotification({
      color: "info",
      text: "Exito, a sido aprobado el cierre diario.",
      open: true
    });
    setTimeout(() => {
      setNotification({
        ...notification,
        open: false
      });
    }, 5000);
  };

  return (
    <AdminLayout>
      <GridContainer>
        <GridItem xs={12} sm={6}>
          <h1>{`${isApprovePage() ? "Aprobar" : "Ver"} Cierre De Caja`}</h1>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <div className={classes.buttonContainer}>
            {isApprovePage() && (
              <Button
                color="primary"
                id="addClientBtn"
                onClick={approveClosure}
              >
                <Check /> APROBAR CIERRE
              </Button>
            )}
            <ExportExcel
              excelData={orders.map(order => ({
                "Numero pedido": order.num_pedido,
                Estado: order.estado_pedido,
                "Nombre Cliente": order.nombre_cliente,
                "Numer Factura": order.numero_factura,
                "Total Pedido": order.total_pedido,
                "Total Pagado": order.valor_pagado_total,
                "Forma de Pago": order.forma_pago,
                "Valor Pagado": order.valor_pago
              }))}
              fileName={"Pedidos"}
              buttonName="Descargar Pedidos"
            />
            <Button
              color="rose"
              id="addClientBtn"
              // eslint-disable-next-line react/prop-types
              onClick={() => props.history.push("/mantenimiento/cierre-diario")}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "1rem"
                }}
              >
                <h4 className={classes.cardIconTitle}>
                  Retorno de dinero ({getTotalMoney()})
                </h4>
                <ExportExcel
                  excelData={money.map(item => ({
                    "FORMA DE PAGO ": item.descripcion,
                    RECAUDADO: item.monto
                  }))}
                  fileName={"RetornoDeDinero"}
                />
              </div>
            </CardHeader>
            <CardBody>
              <CustomTable
                limit={100}
                data={money.map((item, index) => {
                  return [index + 1, item?.descripcion, "$" + item?.monto];
                })}
                headers={["#", "Forma de pago", "Total Recaudado"]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <AssignmentInd />
              </CardIcon>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "1rem"
                }}
              >
                <h4 className={classes.cardIconTitle}>
                  Retorno de productos ({getTotalProducts()})
                </h4>
                <ExportExcel
                  excelData={products.map(item => ({
                    CODIGO: item.des_corta,
                    NOMBRE: item.descripcion,
                    DESPACHADOS: item.cant_despacho,
                    ENTREGADOS: item.cant_entregada,
                    RETORNO: +item?.cant_despacho - +item?.cant_entregada
                  }))}
                  fileName={"RetornoDeProductosx"}
                />
              </div>
            </CardHeader>
            <CardBody>
              <CustomTable
                limit={100}
                data={products.map((product, index) => {
                  return [
                    index + 1,
                    product?.des_corta,
                    product?.descripcion,
                    product?.cant_despacho,
                    product?.cant_entregada,
                    +product?.cant_despacho - +product?.cant_entregada
                  ];
                })}
                headers={[
                  "#",
                  "Código",
                  "Nombre",
                  "Despachados",
                  "Entregados",
                  "Retorno"
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

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
    </AdminLayout>
  );
};

// eslint-disable-next-line react/prop-types
const ExportExcel = ({ excelData, fileName, buttonName = "Descargar" }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button color="warning" id="addClientBtn" onClick={exportToExcel}>
      {buttonName}
    </Button>
  );
};
