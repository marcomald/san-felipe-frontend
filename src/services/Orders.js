import Axios from "axios";
import { generateGetParams } from "helpers/utils";

export const createOrder = async orders => {
  try {
    const response = await Axios.post("/orders", orders);
    return response.data;
  } catch (error) {
    console.error("error creating order by id ->", error);
  }
};

export const deleteOrder = async ordedId => {
  try {
    const response = await Axios.delete("/orders/" + ordedId);
    return response.data;
  } catch (error) {
    console.error("error deleting order by id ->", error);
  }
};

export const editOrder = async (order, orderId) => {
  try {
    const response = await Axios.put("/orders/" + orderId, order);
    return response.data;
  } catch (error) {
    console.error("error creating order by id ->", error);
  }
};

export const getOrderById = async orderID => {
  try {
    const response = await Axios.get("/orders/" + orderID);
    return response.data;
  } catch (error) {
    console.error("error get order by id ->", error);
  }
};

export const getOrdeDetailById = async orderID => {
  try {
    const response = await Axios.get("/order-details?orderId=" + orderID);
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
  }
};

export const getOrders = async (limit, offset, search) => {
  try {
    const queryParams = generateGetParams(limit, offset, search);
    const response = await Axios.get("/orders" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get order detail by order id ->", error);
  }
};
