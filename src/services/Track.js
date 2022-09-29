import Axios from "axios";

export const getTrackByVendedor = async (vendedorId, date) => {
  try {
    const response = await Axios.get(
      `/track?vendedorId=${vendedorId}&fecha=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("error get track by vendedorId and date ->", error);
  }
};
