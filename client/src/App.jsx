import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useCheckAuth } from "./api/authApi";
import { setUser, logout } from "./redux/slice/authSlice";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";

export default function App() {
  const dispatch = useDispatch();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data, isSuccess, isError } = useCheckAuth();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
    } else if (isError && token) {
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }, [data, isSuccess, isError, token, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070714] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f0c1b",
            color: "#f8fafc",
            border: "1px solid rgba(147, 51, 234, 0.3)",
            borderRadius: "12px",
            fontSize: "13px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}