import Axios from "axios";
import { checkUnauthorized, generateGetParams } from "../helpers/utils";

export const getClients = async (limit, offset, clientSearch) => {
  try {
    const queryParams = generateGetParams(limit, offset, clientSearch);
    const response = await Axios.get("/clients" + queryParams);
    return response.data;
  } catch (error) {
    console.error("error get clients ->", error);
    checkUnauthorized(error);
  }
};

export const updateClient = async (client, clientID) => {
  try {
    const response = await Axios.put("/clients/" + clientID, client);
    return response.data;
  } catch (error) {
    console.error("error creating client ->", error);
    checkUnauthorized(error);
  }
};

export const deleteClient = async clientID => {
  try {
    const response = await Axios.delete("/clients/" + clientID);
    return response.data;
  } catch (error) {
    console.error("error creating client ->", error);
    checkUnauthorized(error);
  }
};

export const createClient = async client => {
  try {
    const response = await Axios.post("/clients", client);
    return response.data;
  } catch (error) {
    console.error("error creating client ->", error);
    checkUnauthorized(error);
  }
};

export const getClientByID = async clientId => {
  try {
    const response = await Axios.get("/clients/" + clientId);
    return response.data;
  } catch (error) {
    console.error("error get client by id ->", error);
    checkUnauthorized(error);
  }
};

export const validateExistClientByDocument = async clientDocument => {
  try {
    const response = await Axios.get(
      "/clients/exist/document/" + clientDocument
    );
    return response.data;
  } catch (error) {
    console.error("error get client by document ->", error);
    checkUnauthorized(error);
  }
};

export const updateClientComment = async (clientId, comment, formapago_id) => {
  try {
    const response = await Axios.put(`/clients/${clientId}/comment`, {
      comment,
      formapago_id
    });
    return response.data;
  } catch (error) {
    console.error("error updating client comment ->", error);
    checkUnauthorized(error);
  }
};
