import Axios from "axios";

export const getSellers = async () => {
  try {
    const response = await Axios.get("/users?vendedor=true");
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("error ->", error);
  }
};
