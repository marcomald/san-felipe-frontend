import Axios from "axios";
import { generateGetParams } from "../helpers/utils";

export const getPriceList = async (limit, offset, clientSearch) => {
  try {
    const queryParams = generateGetParams(limit, offset, clientSearch);
    const response = await Axios.get("/price-list" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error ->", error);
  }
};
