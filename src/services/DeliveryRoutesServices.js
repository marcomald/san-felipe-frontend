import Axios from "axios";
import { generateGetParams } from "../helpers/utils";

export const getDeliveryRoutes = async (limit, offset, search) => {
  try {
    const queryParams = generateGetParams(limit, offset, search);
    const response = await Axios.get("/georuta" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get georutas ->", error);
  }
};

export const getDeliveryRouteById = async georuta_id => {
  try {
    const response = await Axios.get("/georuta/" + georuta_id);
    return response.data;
  } catch (error) {
    console.error("error get georutas by id ->", error);
  }
};

export const createDeliveryRoutes = async deliveryRoute => {
  try {
    const response = await Axios.post("/georuta", deliveryRoute);
    return response.data;
  } catch (error) {
    console.error("error creating geo rutas ->", error);
  }
};

export const deleteDeliveryRoute = async deliveryRouteId => {
  try {
    const response = await Axios.delete("/georuta/" + deliveryRouteId);
    return response.data;
  } catch (error) {
    console.error("error deleting geo rutas ->", error);
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
  }
};
