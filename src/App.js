import React, { useState } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import Routes from "./Routes/Routes";

axios.defaults.baseURL = process.env.REACT_APP_DISRTIMARKET_BACKEND_URL;
const accessToken = window.localStorage.getItem("accessToken");
const user = window.localStorage.getItem("user");

function App() {
  const [login, setLogin] = useState({ token: accessToken, user });
  axios.defaults.headers.common["authorization"] = login.token;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

  const onSetLogin = loginUpdate => {
    axios.defaults.headers.common["authorization"] = loginUpdate.token;
    setLogin(loginUpdate);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        onSetLogin
      }}
    >
      <Routes />
    </AuthContext.Provider>
  );
}

export default App;
