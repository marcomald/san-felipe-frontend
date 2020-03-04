//  Views 
import Purchase from "views/Purchases/Purchase.js";
import Sales from "views/Sales/Sales";
import FastTrack from "views/FastTrack/FastTrack";
import Discharged from "views/Discharged/Discharged";
import Consumptions from "views/Consumptions/Consumptions";
import LoginPage from "views/Pages/LoginPage";
import Channels from "views/Channels/Chanels";
import Map from "@material-ui/icons/Map";
import Clients from "views/Clients/Clients";
import Sellers from "views/Sellers/Sellers";
import Users from "views/Users/Users"
import Roles from "views/Roles/Roles"
// @material-ui/icons
import AttachMoney from "@material-ui/icons/AttachMoney";
import SimCard from "@material-ui/icons/SimCard";
import SpeakerPhone from "@material-ui/icons/SpeakerPhone";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import Group from "@material-ui/icons/Group";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Settings from "@material-ui/icons/Settings"
import AssignmentInd from "@material-ui/icons/AssignmentInd"
import Work from "@material-ui/icons/Work"

const filterPermissions = () => {
  const user = window.sessionStorage.getItem("user");
  const urlPath = window.location.pathname;
  if (!user) {
    if (urlPath !== '/login') {
      window.location.replace('/login');
    }
    return [{
      path: "/login",
      name: "Logout",
      rtlName: "Logout",
      icon: ExitToApp,
      component: LoginPage,
      layout: "/auth"
    }]
  }
  const userDecode = JSON.parse(window.atob(user));
  const allowedRoutes = []

  userDecode.permissions.forEach(permission => {
    switch (permission) {
      case "altas":
        allowedRoutes.push({
          path: "/altas",
          name: "Altas",
          rtlName: "Altas",
          icon: SimCard,
          component: Discharged,
          layout: "/admin"
        })
        break;
      case "canales":
        allowedRoutes.push({
          path: "/canales",
          name: "Canales",
          rtlName: "Canales",
          icon: Map,
          component: Channels,
          layout: "/admin"
        })
        break;
      case "clientes":
        allowedRoutes.push({
          path: "/clientes",
          name: "Clientes",
          rtlName: "Clientes",
          icon: AssignmentInd,
          component: Clients,
          layout: "/admin"
        })
        break;
      case "compras":
        allowedRoutes.push({
          path: "/compras",
          name: "Compras",
          rtlName: "Compras",
          icon: ShoppingCart,
          component: Purchase,
          layout: "/admin"
        })
        break;
      case "consumos":
        allowedRoutes.push({
          path: "/consumos",
          name: "Consumos",
          rtlName: "Consumos",
          icon: SpeakerPhone,
          component: Consumptions,
          layout: "/admin"
        })
        break;
      case "fasttrack":
        allowedRoutes.push({
          path: "/fast-track",
          name: "Fast Track",
          rtlName: "Fast Track",
          icon: AssignmentTurnedIn,
          component: FastTrack,
          layout: "/admin"
        })
        break;
      case "roles":
        allowedRoutes.push({
          path: "/roles",
          name: "Roles",
          rtlName: "Roles",
          icon: Settings,
          component: Roles,
          layout: "/admin"
        })
        break;
      case "usuarios":
        allowedRoutes.push({
          path: "/usuarios",
          name: "Usuarios",
          rtlName: "Usuarios",
          icon: Group,
          component: Users,
          layout: "/admin"
        })
        break;
      case "vendedores":
        allowedRoutes.push({
          path: "/vendedores",
          name: "Vendedores",
          rtlName: "Vendedores",
          icon: Work,
          component: Sellers,
          layout: "/admin"
        })
        break;
      case "ventas":
        allowedRoutes.push({
          path: "/despachos-ventas",
          name: "Despachos y ventas",
          rtlName: "Despachos y ventas",
          icon: AttachMoney,
          component: Sales,
          layout: "/admin"
        })
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
  return allowedRoutes
}

export default filterPermissions();
