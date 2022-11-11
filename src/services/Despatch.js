import Axios from "axios";
import { checkUnauthorized } from "helpers/utils";
import { generateGetParams } from "helpers/utils";

export const createDespatch = async despatch => {
  try {
    const response = await Axios.post("/despatch", despatch);
    return response.data;
  } catch (error) {
    console.error("error creating despatch ->", error.response.data.message);
    checkUnauthorized(error);
    if (error.response.data.message) {
      return {
        error: true,
        message: "Ya existe un despacho generado para la ruta seleccionada."
      };
    }
  }
};

export const updateDespatch = async despatch => {
  try {
    const response = await Axios.put(
      `/despatch/${despatch.despatch_id}`,
      despatch
    );
    return response.data;
  } catch (error) {
    console.error("error updating despatch ->", error.response);
    checkUnauthorized(error);
  }
};

export const getDespatchs = async (limit, offset, date, georutaId) => {
  try {
    const queryParams = generateGetParams(limit, offset, "", date, georutaId);
    const response = await Axios.get("/despatch" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get despatchs ->", error);
    checkUnauthorized(error);
  }
};

export const getDespatchById = async despatchId => {
  try {
    const response = await Axios.get("/despatch/" + despatchId);
    return response.data;
  } catch (error) {
    console.error("error get despatch by id ->", error);
    checkUnauthorized(error);
  }
};

export const deleteDespatch = async despatchId => {
  try {
    const response = await Axios.delete("/despatch/" + despatchId);
    return response.data;
  } catch (error) {
    console.error("error deleting despatch by id ->", error);
    checkUnauthorized(error);
  }
};
