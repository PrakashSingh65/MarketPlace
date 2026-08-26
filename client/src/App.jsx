import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCheckAuth } from "./api/authApi";
import { setUser, logout } from "./redux/slice/authSlice";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

export default function App() {
  const dispatch = useDispatch();
  const { data } = useCheckAuth();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else {
      dispatch(logout());
    }
  }, [data, dispatch]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}