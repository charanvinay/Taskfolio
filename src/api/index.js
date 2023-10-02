import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Storage from "../utils/localStore";

const HttpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const callApi = async (url, method = "GET", data) => {
  const token = Storage.get("token");

  const config = {
    method: method,
    url: url,
    data: data,
    headers: {
      authorization: token,
    },
  };
  try {
    const response = await HttpClient(config);
    const { data: responseData, status } = response;

    if (status === 200) {
      if (responseData.status) {
        return { status: responseData.status, data: responseData };
      }
    }

    return { status: false, data: null };
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      window.location.href = "/";
      Storage.clearAll();
    }
    return { status: false, data: error.response.data };
  }
};
export default callApi;
