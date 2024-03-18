import axios from "axios";

const FetchData = async ({ endpoint, method, data }) => {
    const url = `${import.meta.env.VITE_APP_SERVER_URL}/${endpoint}`;
    const token = localStorage.getItem("token");
    const headers = {
        withCredentials: true,
        Authorization: `Bearer ${token}`,
    };
    let response = await axios({
        method,
        url,
        headers,
        data,
    });
    return response.data;
};

export default FetchData;
