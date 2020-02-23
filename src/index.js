/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import App from './App';
// const hist = createBrowserHistory();
// axios.defaults.baseURL = process.env.REACT_APP_DISRTIMARKET_BACKEND_URL
// const accessToken = window.sessionStorage.getItem("accessToken")
// const user = window.sessionStorage.getItem("user")

// const [login, setLogin] = useState({ token: accessToken })

// ReactDOM.render(
//   <AuthContext>
//     <Router history={hist}>
//       <Switch>
//         <Route path="/rtl" component={RtlLayout} />
//         <Route path="/auth" component={AuthLayout} />
//         <Route path="/admin" component={AdminLayout} />
//         <Route path="/purchase" component={PurchaseLayout} />
//         <Redirect from="/" to="/admin/dashboard" />
//       </Switch>
//     </Router>
//   </AuthContext>
//   ,
//   document.getElementById("root")
// );


ReactDOM.render(
  <App />,
  document.getElementById('root')
);