import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";


const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login
  async function loginUser(email, password, navigate,fetchMycourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      fetchMycourse();
      setIsAuth(true);
      navigate("/");
      
    } catch (error) {
      setIsAuth(false);
      toast.error(error?.response?.data?.message || "Login failed");
      console.log(error)
    } finally {
      setBtnLoading(false);
    }
  }

  // Register
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Verify OTP
  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp: Number(otp),
        activationToken,
      });

      toast.success(data.message);
      localStorage.removeItem("activationToken");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Fetch User Data
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loginUser,
        registerUser,
        verifyOtp,
        btnLoading,
        loading,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);

//funstories1111@gmail.com
