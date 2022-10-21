import Axios from "axios";

export const getSellers = async () => {
  try {
    const response = await Axios.get("/users?vendedor=true");
    return response.data;
  } catch (error) {
    console.error("error ->", error);
  }
};
