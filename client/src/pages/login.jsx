import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useSignIn } from "../api/authApi";
import { setUser } from "../redux/slice/authSlice";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutateAsync: login, isPending: loading } = useSignIn();

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      if (response.success && response.user) {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user._id) {
          localStorage.setItem("userId", response.user._id);
        }

        dispatch(setUser(response.user));
        queryClient.setQueryData(["user"], { user: response.user, success: true });
        toast.success(`Welcome back, ${response.user.name || "User"}!`);

        if (response.user.role === "SUPPLIER") {
          navigate("/supplier-dashboard");
        } else {
          navigate("/marketplace");
        }
      } else {
        setErrorMessage(response.message || "Invalid credentials");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070714] p-4 font-sans">
      <div className="max-w-md w-full bg-[#0e0a1f] rounded-3xl border border-purple-900/50 shadow-[0_0_50px_rgba(112,0,255,0.15)] p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
            <Sparkles size={13} className="text-orange-400" />
            <span>MarketPlace B2B Portal</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to access your B2B account
          </p>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 px-4 py-3 rounded-2xl text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="buyer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#140f2d] border border-purple-900/60 rounded-xl text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#140f2d] border border-purple-900/60 rounded-xl text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center transition shadow-lg shadow-orange-500/20 text-xs disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Signing in...
              </>
            ) : (
              "Sign In to Account"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-xs text-slate-400 border-t border-purple-900/30 pt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-orange-400 hover:text-orange-300 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
