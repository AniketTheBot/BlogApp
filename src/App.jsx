import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./store/authSlice";
import { useRoutes } from "react-router-dom";
import { routeConfig } from "./routes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);


  const elements = useRoutes(routeConfig);
  return elements;
}

export default App;
