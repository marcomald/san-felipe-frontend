/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink } from "react-router-dom";
import cx from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import IconPerson from "@material-ui/icons/Person";
// import ExitToApp from "@material-ui/icons/ExitToApp";
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
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.js";
import avatar from "assets/img/faces/avatar.jpg";
var ps;
// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  sidebarWrapper = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapper.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref={this.sidebarWrapper}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      miniActive: true,
      ...this.getCollapseStates(props.routes)
    };
  }
  mainPanel = React.createRef();
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = routes => {
    let initialState = {};
    routes.map(prop => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };
  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }

  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = () => {
    const { classes, color, rtlActive } = this.props;
    const user = window.sessionStorage.getItem("user")
    const token = window.sessionStorage.getItem("accessToken")
    if (!user || !token) {
      this.props.history.push('/login');
      return
    }
    const userDecode = JSON.parse(window.atob(user));
    const allowedRoutes = [];
    userDecode.permissions.forEach(permission => {
      switch (permission) {
        case "altas":
          allowedRoutes.push({
            path: "/altas",
            name: "Altas",
            rtlName: "Altas",
            icon: SimCard,
            component: Discharged,
            layout: "/procesos"
          })
          break;
        case "canales":
          allowedRoutes.push({
            path: "/canales",
            name: "Canales",
            rtlName: "Canales",
            icon: Map,
            component: Channels,
            layout: "/mantenimiento"
          })
          break;
        case "clientes":
          allowedRoutes.push({
            path: "/clientes",
            name: "Clientes",
            rtlName: "Clientes",
            icon: AssignmentInd,
            component: Clients,
            layout: "/mantenimiento"
          })
          break;
        case "compras":
          allowedRoutes.push({
            path: "/compras",
            name: "Compras",
            rtlName: "Compras",
            icon: ShoppingCart,
            component: Purchase,
            layout: "/procesos"
          })
          break;
        case "consumos":
          allowedRoutes.push({
            path: "/consumos",
            name: "Consumos",
            rtlName: "Consumos",
            icon: SpeakerPhone,
            component: Consumptions,
            layout: "/procesos"
          })
          break;
        case "fasttrack":
          allowedRoutes.push({
            path: "/fast-tracks",
            name: "Fast Track",
            rtlName: "Fast Track",
            icon: AssignmentTurnedIn,
            component: FastTrack,
            layout: "/procesos"
          })
          break;
        case "roles":
          allowedRoutes.push({
            path: "/roles",
            name: "Roles",
            rtlName: "Roles",
            icon: Settings,
            component: Roles,
            layout: "/mantenimiento"
          })
          break;
        case "usuarios":
          allowedRoutes.push({
            path: "/usuarios",
            name: "Usuarios",
            rtlName: "Usuarios",
            icon: Group,
            component: Users,
            layout: "/mantenimiento"
          })
          break;
        case "vendedores":
          allowedRoutes.push({
            path: "/vendedores",
            name: "Vendedores",
            rtlName: "Vendedores",
            icon: Work,
            component: Sellers,
            layout: "/mantenimiento"
          })
          break;
        case "ventas":
          allowedRoutes.push({
            path: "/despachos-ventas",
            name: "Despachos y ventas",
            rtlName: "Despachos y ventas",
            icon: AttachMoney,
            component: Sales,
            layout: "/procesos"
          })
          break;
        default:
          break;
      }
    });

    allowedRoutes.push({
      path: "/login",
      name: "Cerrar sesion",
      rtlName: "Cerrar sesion",
      icon: ExitToApp,
      component: LoginPage,
      layout: ""
    })

    return allowedRoutes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        const navLinkClasses =
          classes.itemLink +
          " " +
          cx({
            [" " + classes.collapseActive]: this.getCollapseInitialState(
              prop.views
            )
          });
        const itemText =
          classes.itemText +
          " " +
          cx({
            [classes.itemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.itemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.itemTextRTL]: rtlActive
          });
        const collapseItemText =
          classes.collapseItemText +
          " " +
          cx({
            [classes.collapseItemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextRTL]: rtlActive
          });
        const itemIcon =
          classes.itemIcon +
          " " +
          cx({
            [classes.itemIconRTL]: rtlActive
          });
        const caret =
          classes.caret +
          " " +
          cx({
            [classes.caretRTL]: rtlActive
          });
        const collapseItemMini =
          classes.collapseItemMini +
          " " +
          cx({
            [classes.collapseItemMiniRTL]: rtlActive
          });
        return (
          <ListItem
            key={key}
            className={cx(
              { [classes.item]: prop.icon !== undefined },
              { [classes.collapseItem]: prop.icon === undefined }
            )}
          >
            <NavLink
              to={"#"}
              className={navLinkClasses}
              onClick={e => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                typeof prop.icon === "string" ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                    <prop.icon className={itemIcon} />
                  )
              ) : (
                  <span className={collapseItemMini}>
                    {rtlActive ? prop.rtlMini : prop.mini}
                  </span>
                )}
              <ListItemText
                primary={rtlActive ? prop.rtlName : prop.name}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      (this.state[prop.state] ? classes.caretActive : "")
                    }
                  />
                }
                disableTypography={true}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
                )}
              />
            </NavLink>
            <Collapse in={this.state[prop.state]} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                {this.createLinks(prop.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }
      const innerNavLinkClasses =
        classes.collapseItemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.path)
        });
      const collapseItemMini =
        classes.collapseItemMini +
        " " +
        cx({
          [classes.collapseItemMiniRTL]: rtlActive
        });
      const navLinkClasses =
        classes.itemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.path)
        });
      const itemText =
        classes.itemText +
        " " +
        cx({
          [classes.itemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.itemTextMiniRTL]:
            rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.itemTextRTL]: rtlActive
        });
      const collapseItemText =
        classes.collapseItemText +
        " " +
        cx({
          [classes.collapseItemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextMiniRTL]:
            rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextRTL]: rtlActive
        });
      const itemIcon =
        classes.itemIcon +
        " " +
        cx({
          [classes.itemIconRTL]: rtlActive
        });
      return (
        <ListItem
          key={key}
          className={cx(
            { [classes.item]: prop.icon !== undefined },
            { [classes.collapseItem]: prop.icon === undefined }
          )}
        >
          <NavLink
            to={prop.layout + prop.path}
            className={cx(
              { [navLinkClasses]: prop.icon !== undefined },
              { [innerNavLinkClasses]: prop.icon === undefined }
            )}
          >
            {prop.icon !== undefined ? (
              typeof prop.icon === "string" ? (
                <Icon className={itemIcon}>{prop.icon}</Icon>
              ) : (
                  <prop.icon className={itemIcon} />
                )
            ) : (
                <span className={collapseItemMini}>
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
              )}
            <ListItemText
              primary={rtlActive ? prop.rtlName : prop.name}
              disableTypography={true}
              className={cx(
                { [itemText]: prop.icon !== undefined },
                { [collapseItemText]: prop.icon === undefined }
              )}
            />
          </NavLink>
        </ListItem>
      );
    });
  };
  // --------------------------------------------------------------------
  render() {

    const userLogged = JSON.parse(atob(window.sessionStorage.getItem("user")));
    const {
      classes,
      logo,
      image,
      logoText,
      routes,
      bgColor,
      rtlActive
    } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive
      });
    var user = (
      <div className={userWrapperClass}>
        <List className={classes.list}>
          <ListItem className={classes.item + " " + classes.userItem}>
            <NavLink
              to={"#"}
              className={classes.itemLink + " " + classes.userCollapseButton}
              onClick={() => this.openCollapse("openAvatar")}
            >
              <ListItemText
                primary={userLogged.userName}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      classes.userCaret +
                      " " +
                      (this.state.openAvatar ? classes.caretActive : "")
                    }
                  />
                }
                disableTypography={true}
                className={itemText + " " + classes.userItemText}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      <IconPerson />
                    </span>
                    <ListItemText
                      primary="Mi perfil"
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );
    var links = (
      <List className={classes.list}>{this.createLinks(routes)}</List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    var brand = (
      <div className={logoClasses}>
        <a
          href="https://www.creative-tim.com?ref=mdpr-sidebar"
          target="_blank"
          className={logoMini}
        >
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a
          href="https://www.creative-tim.com?ref=mdpr-sidebar"
          target="_blank"
          className={logoNormal}
        >
          {logoText}
        </a>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div ref={this.mainPanel}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<AdminNavbarLinks rtlActive={rtlActive} />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")", backgroundPosition: "left !important" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")", backgroundPosition: "left" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue"
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose"
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object
};

export default withStyles(sidebarStyle)(Sidebar);
