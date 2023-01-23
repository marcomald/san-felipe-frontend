import Axios from "axios";
import { checkUnauthorized } from "helpers/utils";
import { generateGetParams } from "helpers/utils";

export const createOrder = async orders => {
  try {
    const response = await Axios.post("/orders/single", orders, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("error creating order by id ->", error);
    checkUnauthorized(error);
  }
};

export const deleteOrder = async ordedId => {
  try {
    const response = await Axios.delete("/orders/" + ordedId);
    return response.data;
  } catch (error) {
    console.error("error deleting order by id ->", error);
    checkUnauthorized(error);
  }
};

export const editOrder = async (order, orderId) => {
  try {
    const response = await Axios.put("/orders/single/" + orderId, order, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("error creating order by id ->", error);
    checkUnauthorized(error);
  }
};

export const getOrderById = async orderID => {
  try {
    const response = await Axios.get("/orders/" + orderID);
    return response.data;
  } catch (error) {
    console.error("error get order by id ->", error);
    checkUnauthorized(error);
  }
};

export const getOrdeDetailById = async orderID => {
  try {
    const response = await Axios.get("/order-details?orderId=" + orderID);
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
    checkUnauthorized(error);
  }
};

export const getOrders = async (
  limit,
  offset,
  search,
  deliveryDate,
  georutaId
) => {
  try {
    const queryParams = generateGetParams(
      limit,
      offset,
      search,
      deliveryDate,
      georutaId
    );
    const response = await Axios.get("/orders" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
    checkUnauthorized(error);
  }
};

export const getShippify = async (georouteId, date) => {
  try {
    const response = await Axios.get(
      `/orders/shippify/georoute/${georouteId}/date/:${date}`
    );
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
    checkUnauthorized(error);
  }
};

export const getOrdersByGoeroute = async (georouteId, date) => {
  try {
    const response = await Axios.get(
      `/orders/by-georoute/${georouteId}/date/${date}`
    );
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
    checkUnauthorized(error);
  }
};
