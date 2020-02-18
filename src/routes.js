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

const dashRoutes = [
  {
    path: "/compras",
    name: "Compras",
    rtlName: "Compras",
    icon: ShoppingCart,
    component: Purchase,
    layout: "/admin"
  },
  {
    path: "/altas",
    name: "Altas",
    rtlName: "Altas",
    icon: SimCard,
    component: Discharged,
    layout: "/admin"
  },
  {
    path: "/consumos",
    name: "Consumos",
    rtlName: "Consumos",
    icon: SpeakerPhone,
    component: Consumptions,
    layout: "/admin"
  },
  {
    path: "/despachos-ventas",
    name: "Despachos y ventas",
    rtlName: "Despachos y ventas",
    icon: AttachMoney,
    component: Sales,
    layout: "/admin"
  },
  {
    path: "/fast-track",
    name: "Fast Track",
    rtlName: "Fast Track",
    icon: AssignmentTurnedIn,
    component: FastTrack,
    layout: "/admin"
  },
  {
    path: "/canales",
    name: "Canales",
    rtlName: "Canales",
    icon: Map,
    component: Channels,
    layout: "/admin"
  },
  {
    path: "/clientes",
    name: "Clientes",
    rtlName: "Clientes",
    icon: AssignmentInd,
    component: Clients,
    layout: "/admin"
  },
  {
    path: "/vendedores",
    name: "Vendedores",
    rtlName: "Vendedores",
    icon: Work,
    component: Sellers,
    layout: "/admin"
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    rtlName: "Usuarios",
    icon: Group,
    component: Users,
    layout: "/admin"
  },
  {
    path: "/roles",
    name: "Roles",
    rtlName: "Roles",
    icon: Settings,
    component: Roles,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Logout",
    rtlName: "Logout",
    icon: ExitToApp,
    component: LoginPage,
    layout: "/auth"
  },
]
export default dashRoutes;
