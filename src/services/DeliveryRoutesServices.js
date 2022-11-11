import Axios from "axios";
import { checkUnauthorized, generateGetParamsGeoruta } from "../helpers/utils";

export const getDeliveryRoutes = async (limit, offset, search, date) => {
  try {
    const queryParams = generateGetParamsGeoruta(limit, offset, search, date);
    const response = await Axios.get("/georuta" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get georutas ->", error);
    checkUnauthorized(error);
  }
};

export const getDeliveryRouteById = async (
  georuta_id,
  visitFrequency = "L"
) => {
  try {
    const response = await Axios.get(
      `/georuta/${georuta_id}?visitFrequency=${visitFrequency}`
    );
    return response.data;
  } catch (error) {
    console.error("error get georutas by id ->", error);
    checkUnauthorized(error);
  }
};

export const getDeliveryRouteProducts = async georuta_id => {
  try {
    const response = await Axios.get(`/georuta/${georuta_id}/products`);
    return response.data;
  } catch (error) {
    console.error("error get products of georutas by id ->", error);
    checkUnauthorized(error);
  }
};

export const createDeliveryRoutes = async deliveryRoute => {
  try {
    const response = await Axios.post("/georuta", deliveryRoute);
    return response.data;
  } catch (error) {
    console.error("error creating geo rutas ->", error);
    checkUnauthorized(error);
  }
};

export const deleteDeliveryRoute = async deliveryRouteId => {
  try {
    const response = await Axios.delete("/georuta/" + deliveryRouteId);
    return response.data;
  } catch (error) {
    console.error("error deleting geo rutas ->", error);
    checkUnauthorized(error);
  }
};

export const updateDeliveryRoutes = async (deliveryRouteId, deliveryRoute) => {
  try {
    const response = await Axios.put(
      "/georuta/" + deliveryRouteId,
      deliveryRoute
    );
    return response.data;
  } catch (error) {
    console.error("error updating geo rutas ->", error);
    checkUnauthorized(error);
  }
};
