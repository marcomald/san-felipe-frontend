/* eslint-disable react/prop-types */
import { makeStyles } from "@material-ui/core";
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
import Button from "components/CustomButtons/Button.js";
import { CloudDownload } from "@material-ui/icons";
import { CustomDatePicker } from "components/CustomDatePicker/CustomDatePicker";
import Selector from "components/CustomDropdown/CustomSelector";
import { getDeliveryRoutes } from "services/DeliveryRoutesServices";
import { formatToSelectOption } from "helpers/utils";
import { getShippify } from "services/Orders";
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

export default function Shippify(props) {
  const [report, setReport] = useState({ fecha: new Date() });
  const [georoutes, setGeoroutes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetchGeoroutes();
  }, []);

  const fetchGeoroutes = async () => {
    const retrievedGeoroutes = await getDeliveryRoutes("", "", "");
    setGeoroutes(
      formatToSelectOption(retrievedGeoroutes.georutas, "georuta_id", "nombre")
    );
  };

  const handleForm = (key, value) => {
    const reportOptions = { ...report };
    reportOptions[key] = value;
    setReport(reportOptions);
  };

  const generateReport = async () => {
    const url = await getShippify(report?.georoute?.value, report?.fecha);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AdminLayout>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <h1>
              Generar reporte <b>Shippify</b>
            </h1>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div className={classes.buttonContainer}>
              <Button
                color="rose"
                id="addClientBtn"
                onClick={() => props.history.push("/inicio")}
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
                  <CloudDownload />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Seleccione los siguientes datos
                </h4>
              </CardHeader>
              <CardBody>
                <form>
                  <GridContainer>
                    <GridItem md={6}>
                      <Selector
                        placeholder="Ruta de entrega"
                        options={georoutes}
                        onChange={value => handleForm("georoute", value)}
                        value={report?.georoute}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <CustomDatePicker
                        placeholder="Fecha"
                        value={report?.fecha ?? new Date()}
                        onChange={date => handleForm("fecha", date)}
                      />
                    </GridItem>
                  </GridContainer>
                  <br />
                  <Button
                    color="primary"
                    disabled={false}
                    onClick={generateReport}
                  >
                    Generar Reporte
                  </Button>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <br />
      </React.Fragment>
    </AdminLayout>
  );
}
