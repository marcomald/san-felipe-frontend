/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import AdminLayout from "layouts/Admin";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Tooltip } from "@material-ui/core";
import { AssignmentInd, Check, RemoveRedEye } from "@material-ui/icons";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CustomTable from "components/Table/CustomTable";
import LoaderComponent from "components/Loader/Loader";
import Snackbar from "components/Snackbar/Snackbar";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import CardBody from "components/Card/CardBody";
import { getClosures } from "services/Despatch";
import moment from "moment";
import { makeStyles } from "@material-ui/styles";
import Button from "components/CustomButtons/Button.js";

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

export const ClousureList = props => {
  const [notification, setNotification] = useState({
    color: "info",
    text: "",
    open: false
  });
  const [clientSearch, setClientSearch] = React.useState("");
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = useState({ despatchs: [], total: 0 });
  const classes = useStyles();

  useEffect(() => {
    fetchDespatch();
  }, [offset, limit]);

  const fetchDespatch = async () => {
    setLoading(true);
    const retrievedDespatch = await getClosures(limit, offset, "", "");
    if (retrievedDespatch && retrievedDespatch.closure) {
      setData({
        despatchs: retrievedDespatch.closure.despatchs,
        total: retrievedDespatch.total
      });
    }
    setLoading(false);
  };

  const redirectPage = (color, despatch_id) => {
    if (color === "success") {
      props.history.push(
        "/mantenimiento/cierre-diario/" + despatch_id + "/aprobar"
      );
      return;
    }
    props.history.push("/mantenimiento/cierre-diario/" + despatch_id + "/ver");
  };

  const fillButtons = despatch => {
    const buttons = [
      { color: "success", icon: Check },
      { color: "info", icon: RemoveRedEye }
    ].map((prop, key) => {
      return (
        <Tooltip
          id="tooltip-top"
          title={prop.color === "success" ? "Generar Cierre" : "Ver Detalle"}
          placement="top"
          classes={{ tooltip: classes.tooltip }}
          key={key}
        >
          <Button
            color={prop.color}
            className={classes.actionButton}
            onClick={() => redirectPage(prop.color, despatch.despatch_number)}
          >
            <prop.icon className={classes.icon} />
          </Button>
        </Tooltip>
      );
    });
    if (despatch.closure_completed) {
      return [buttons[1]];
    }
    return buttons;
  };

  return (
    <AdminLayout>
      <GridContainer>
        <GridItem xs={12} sm={6}>
          <h1>Cierre de Caja Diario</h1>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <AssignmentInd />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Cierres registrados</h4>
            </CardHeader>
            <CardBody>
              <CustomTable
                data={data?.despatchs?.map(despatch => {
                  return [
                    despatch?.despatch_number ?? 1,
                    despatch?.nombre,
                    moment.utc(despatch?.date).format("DD-MM-YYYY"),
                    despatch.estado.toUpperCase() === "A"
                      ? "Activo"
                      : "Inactivo",
                    despatch?.total_dispatched,
                    despatch?.total_billed,
                    despatch?.total_dispatched - despatch?.total_billed,
                    fillButtons(despatch)
                  ];
                })}
                limite={limit}
                headers={[
                  "Número Despacho",
                  "Ruta",
                  "Fecha",
                  "Estado",
                  "Despachados",
                  "Entregados",
                  "Retorno",
                  "Acción"
                ]}
                onOffsetChange={valueOffset => {
                  setOffset(valueOffset);
                }}
                total={data?.total ?? 0}
                changeLimit={limite => {
                  setLimit(limite);
                }}
                offset={offset}
                onSearchChange={name => {
                  setClientSearch(name);
                }}
                searchValue={clientSearch}
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
