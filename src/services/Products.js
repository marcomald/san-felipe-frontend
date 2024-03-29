import Axios from "axios";
import { checkUnauthorized, generateGetParams } from "../helpers/utils";

export const getProducts = async (limit, offset, clientSearch) => {
  try {
    const queryParams = generateGetParams(limit, offset, clientSearch);
    const response = await Axios.get("/products" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get products ->", error);
    checkUnauthorized(error);
  }
};

export const getProductPrice = async (producto_id, sucursal_id, client_id) => {
  try {
    const response = await Axios.get(
      `/prices/product/${producto_id}/branch-office/${sucursal_id}/client/${client_id}`
    );
    return response.data;
  } catch (error) {
    console.error("error get product price ->", error);
    checkUnauthorized(error);
    if (error.request.status === 404) {
      return {
        error: true,
        message: "No se encontro un precio vinculado al producto"
      };
    }
  }
};
