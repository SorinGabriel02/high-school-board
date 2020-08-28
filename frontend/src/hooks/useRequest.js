import { useState, useCallback, useRef } from "react";
import axios from "axios";

const useRequest = () => {
  const cancelReq = useRef(null);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const makeReq = useCallback(
    async (verb, url, bodyParams = null, config = null) => {
      try {
        cancelReq.current = axios.CancelToken.source();
        const response = await axios[verb](url, bodyParams, {
          ...config,
          cancelToken: cancelReq.current.token,
        });
        setData(response.data);
      } catch (error) {
        if (error.response.status === 500) {
          return setErrorMessage("Server error. Please try again later.");
        }
        if (error.response.status === 401) {
          return setErrorMessage(
            "Invalid credentials. Please check and try again."
          );
        }
        if (!error.response.data || !error.response.data.errorMessage) {
          return setErrorMessage(
            "Something went wrong. Please try again later"
          );
        }
        setErrorMessage(error.response.data.errorMessage);
      }
    },
    []
  );

  const clearError = () => setErrorMessage("");

  return [data, errorMessage, makeReq, cancelReq.current, clearError];
};

export default useRequest;
