import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import Altas from '../views/Discharged/Discharged'
import Canales from '../views/Channels/Chanels'
import Clientes from '../views/Clients/Clients'
import Compras from '../views/Purchases/Purchase'
import Consumos from '../views/Consumptions/Consumptions'
import FastTracks from '../views/FastTrack/FastTrack'
import Roles from '../views/Roles/Roles'
import Usuarios from '../views/Users/Users'
import Vendedores from '../views/Sellers/Sellers'
import Ventas from '../views/Sales/Sales'
import Login from '../views/Pages/LoginPage'
import ErrorPage from '../views/Pages/ErrorPage'
import Home from '../views/Pages/HomePage'
import UserProfile from 'views/UserProfile/UserProfile'

const PrivateRoutes = (permissions) => {
    const allowedRoutes = [];
    permissions.forEach(permission => {
        switch (permission) {
            case "altas":
                allowedRoutes.push(<Route path="/procesos/altas" exact component={Altas} key="altas" />)
                break;
            case "canales":
                allowedRoutes.push(<Route path="/mantenimiento/canales" exact component={Canales} key="canales" />)
                break;
            case "clientes":
                allowedRoutes.push(<Route path="/mantenimiento/clientes" exact component={Clientes} key="clientes" />)
                break;
            case "compras":
                allowedRoutes.push(<Route path="/procesos/compras" exact component={Compras} key="compras" />)
                break;
            case "consumos":
                allowedRoutes.push(<Route path="/procesos/consumos" exact component={Consumos} key="consumos" />)
                break;
            case "fasttrack":
                allowedRoutes.push(<Route path="/procesos/fast-tracks" exact component={FastTracks} key="fast-tracks" />)
                break;
            case "roles":
                allowedRoutes.push(<Route path="/mantenimiento/roles" exact component={Roles} key="roles" />)
                break;
            case "usuarios":
                allowedRoutes.push(<Route path="/mantenimiento/usuarios" exact component={Usuarios} key="usuarios" />)
                break;
            case "vendedores":
                allowedRoutes.push(<Route path="/mantenimiento/vendedores" exact component={Vendedores} key="vendedores" />)
                break;
            case "ventas":
                allowedRoutes.push(<Route path="/procesos/despachos-ventas" exact component={Ventas} key="ventas" />)
                break;
            default:
                break;
        }
    })

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
    )
}

const PublicRoutes = () => (
    <Router>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Redirect to="/login" />
        </Switch>
    </Router>
)

const Routes = () => {
    const user = window.sessionStorage.getItem("user")
    const token = window.sessionStorage.getItem("accessToken")
    if (!user || !token) {
        return PublicRoutes()
    }
    const userDecode = JSON.parse(window.atob(user));
    return PrivateRoutes(userDecode.permissions)
}

export default Routes;