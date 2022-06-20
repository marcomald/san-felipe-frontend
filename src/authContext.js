import { createContext } from "react";

const ThemeContext = createContext({
  login: { token: "", user: {} }
});

export default ThemeContext;
