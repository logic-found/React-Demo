import { useState, useEffect } from "react";
import ErrorHandler from "../utils/ErrorHandler";
import FetchData from "./FetchData";


const useAxios = ({ endpoint, method, data }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await FetchData({ endpoint, method, data })
        setLoading(false);
        setResponseData(response);
      } catch (error) {
        setLoading(false);
        ErrorHandler(error); 
      }
    };
    fetchData(); 
  }, []); 

  return { loading, data: responseData};
};

export default useAxios;
