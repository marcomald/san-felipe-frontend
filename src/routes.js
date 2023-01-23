//  Views
import LoginPage from "views/Pages/LoginPage";
import Clients from "views/Clients/Clients";
import Users from "views/Users/Users";
import Roles from "views/Roles/Roles";
// @material-ui/icons
import Group from "@material-ui/icons/Group";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Settings from "@material-ui/icons/Settings";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
import Pedidos from "views/Orders/OrdersList";

const filterPermissions = () => {
  const user = window.localStorage.getItem("user");
  const urlPath = window.location.pathname;
  if (!user) {
    if (urlPath !== "/login") {
      window.location.replace("/login");
    }
    return [
      {
        path: "/login",
        name: "Logout",
        rtlName: "Logout",
        icon: ExitToApp,
        component: LoginPage,
        layout: "/auth"
      }
    ];
  }
  const userDecode = JSON.parse(window.atob(user));
  const allowedRoutes = [];

  userDecode.permissions.forEach(permission => {
    switch (permission) {
      case "clientes":
        allowedRoutes.push({
          path: "/clientes",
          name: "Clientes",
          rtlName: "Clientes",
          icon: AssignmentInd,
          component: Clients,
          layout: "/admin"
        });
        break;
      case "roles":
        allowedRoutes.push({
          path: "/roles",
          name: "Roles",
          rtlName: "Roles",
          icon: Settings,
          component: Roles,
          layout: "/admin"
        });
        break;
      case "usuarios":
        allowedRoutes.push({
          path: "/usuarios",
          name: "Usuarios",
          rtlName: "Usuarios",
          icon: Group,
          component: Users,
          layout: "/admin"
        });
        break;
      case "pedidos":
        allowedRoutes.push({
          path: "/pedidos",
          name: "Pedidos",
          rtlName: "Pedidos",
          icon: Group,
          component: Pedidos,
          layout: "/admin"
        });
        break;
      default:
        break;
    }
  });
  allowedRoutes.push({
    path: "/login",
    name: "Logout",
    rtlName: "Logout",
    icon: ExitToApp,
    component: LoginPage,
    layout: "/auth"
  });
  return allowedRoutes;
};

export default filterPermissions();
