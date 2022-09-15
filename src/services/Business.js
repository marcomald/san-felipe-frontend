import Axios from "axios";
import { generateGetParams } from "../helpers/utils";

export const getBusiness = async (limit, offset, clientSearch) => {
  try {
    const queryParams = generateGetParams(limit, offset, clientSearch);
    const response = await Axios.get("/business" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error ->", error);
  }
};
