import React, { useState } from 'react'
import axios from "axios";
import AuthContext from "./authContext";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import PurchaseLayout from "layouts/Admin.js";

const hist = createBrowserHistory();
axios.defaults.baseURL = process.env.REACT_APP_DISRTIMARKET_BACKEND_URL
const accessToken = window.sessionStorage.getItem("accessToken")
const user = window.sessionStorage.getItem("user")

function App() {
    const [login, setLogin] = useState({ token: accessToken, user })
    axios.defaults.headers.common['authorization'] = login.token;
    const onSetLogin = (loginUpdate) => {
        axios.defaults.headers.common['authorization'] = loginUpdate.token;
        setLogin(loginUpdate)
    }

    return (
        <AuthContext.Provider
            value={{
                login,
                onSetLogin,
            }}
        >
            <Router history={hist}>
                <Switch>
                    <Route path="/rtl" component={RtlLayout} />
                    <Route path="/auth" component={AuthLayout} />
                    <Route path="/admin" component={AdminLayout} />
                    <Route path="/purchase" component={PurchaseLayout} />
                    <Redirect from="/" to="/admin/dashboard" />
                </Switch>
            </Router>
        </AuthContext.Provider>
    )
}

export default App