import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Clientes from "../views/Clients/Clients";
import Roles from "../views/Roles/Roles";
import Usuarios from "../views/Users/Users";
import Login from "../views/Pages/LoginPage";
import ErrorPage from "../views/Pages/ErrorPage";
import Home from "../views/Pages/HomePage";
import UserProfile from "views/UserProfile/UserProfile";
import Pedidos from "views/Orders/OrdersList";
import OrdersForm from "views/Orders/OrdersForm";
import DeliveryRoutesList from "views/DeliveryRoutes/DeliveryRoutesList";
import DeliveryRoutesForm from "views/DeliveryRoutes/DeliveryRoutesForm";
import ClientForm from "../views/Clients/ClientForm";
import ClientFormEdit from "../views/Clients/ClientFormEdit";
import DeliveryRoutesFormEdit from "../views/DeliveryRoutes/DeliveryRoutesFormEdit";
import DeliveryRoutesClients from "../views/DeliveryRoutes/DeliveryRoutesClients";

const PrivateRoutes = permissions => {
  const allowedRoutes = [];
  permissions.forEach(permission => {
    switch (permission) {
      case "clientes":
        allowedRoutes.push(
          <Route
            path="/mantenimiento/clientes"
            exact
            component={Clientes}
            key="clientes"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/clientes/crear"
            exact
            component={ClientForm}
            key="clientes"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/clientes/editar/:id"
            exact
            component={ClientFormEdit}
            key="clientes"
          />
        );
        break;
      case "roles":
        allowedRoutes.push(
          <Route
            path="/mantenimiento/roles"
            exact
            component={Roles}
            key="roles"
          />
        );
        break;
      case "usuarios":
        allowedRoutes.push(
          <Route
            path="/mantenimiento/usuarios"
            exact
            component={Usuarios}
            key="usuarios"
          />
        );
        break;
      case "pedidos":
        allowedRoutes.push(
          <Route
            path="/mantenimiento/pedidos"
            exact
            component={Pedidos}
            key="mantenimientos"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/pedidos/crear"
            exact
            component={OrdersForm}
            key="mantenimientos-crear"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/pedidos/editar/:id"
            exact
            component={OrdersForm}
            key="mantenimientos-editar"
          />
        );
        break;
      case "rutas":
        allowedRoutes.push(
          <Route
            path="/mantenimiento/rutas-de-entrega"
            exact
            component={DeliveryRoutesList}
            key="rutas-de-entrega"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/rutas-de-entrega/crear/"
            exact
            component={DeliveryRoutesForm}
            key="rutas-de-entrega"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/rutas-de-entrega/editar/:id"
            exact
            component={DeliveryRoutesFormEdit}
            key="rutas-de-entrega"
          />
        );
        allowedRoutes.push(
          <Route
            path="/mantenimiento/rutas-de-entrega/ver/:id"
            exact
            component={DeliveryRoutesClients}
            key="rutas-de-entrega"
          />
        );
        break;
      default:
        break;
    }
  });

  return (
    <Router>
      <Switch>
        {allowedRoutes}
        <Route path="/login" exact component={Login} />
        <Route path="/inicio" exact component={Home} />
        <Route path="/perfil" exact component={UserProfile} />
        <Route path="/not-found" exact component={ErrorPage} />
        <Redirect to="/not-found" />
      </Switch>
    </Router>
  );
};

const PublicRoutes = () => (
  <Router>
    <Switch>
      <Route path="/login" exact component={Login} />
      <Redirect to="/login" />
    </Switch>
  </Router>
);

const Routes = () => {
  const user = window.sessionStorage.getItem("user");
  const token = window.sessionStorage.getItem("accessToken");
  if (!user || !token) {
    return PublicRoutes();
  }
  const userDecode = JSON.parse(window.atob(user));
  return PrivateRoutes(userDecode.permissions);
};

export default Routes;
