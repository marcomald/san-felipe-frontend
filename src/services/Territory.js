import Axios from "axios";
import { generateGetParams } from "../helpers/utils";

export const getTerritories = async (limit, offset, clientSearch) => {
  try {
    const queryParams = generateGetParams(limit, offset, clientSearch);
    const response = await Axios.get("/territories" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get territories->", error);
  }
};

export const getTerritory = async territoryId => {
  try {
    const response = await Axios.get("/territories/" + territoryId);
    return response.data;
  } catch (error) {
    console.error("error get territory by id ->", error);
  }
};
