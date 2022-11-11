import Axios from "axios";
import { checkUnauthorized } from "helpers/utils";

export const getSellers = async () => {
  try {
    const response = await Axios.get("/users?vendedor=true");
    return response.data;
  } catch (error) {
    console.error("error ->", error);
    checkUnauthorized(error);
  }
};
