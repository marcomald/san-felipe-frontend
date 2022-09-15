import Axios from "axios";

export const getOrderById = async orderID => {
  try {
    const response = await Axios.get("/orders/" + orderID);
    return response.data;
  } catch (error) {
    console.error("error get order by id ->", error);
  }
};
