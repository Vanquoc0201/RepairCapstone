import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../HomeTemplate/Login/userSlice";
import api from "../../../services/api";

export default function Login() {
  const [user, setUserState] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

    useEffect(() => {
      const savedUser = localStorage.getItem("userInfo");
      if (savedUser) {
        dispatch(setUser(JSON.parse(savedUser)));
        navigate("/"); // Chuyển hướng nếu đã đăng nhập trước đó
      }
    }, [dispatch, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserState({
      ...user,
      [name]: value,
    });
  };

  // Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await api.post("QuanLyNguoiDung/DangNhap", user);
    const userData = result.data.content;
    
    // Lưu vào Redux
    dispatch(setUser(userData));
    
    // Lưu vào Local Storage
    localStorage.setItem("userInfo", JSON.stringify(userData));
    
    toast.success("Đăng nhập thành công", { position: "bottom-right" });
    
    // Chuyển hướng sang trang chính
    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.content || "Đăng nhập thất bại", { position: "bottom-right" });
  }
};


  return (
    <div>
      <h1>LoginPage</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label htmlFor="taiKhoan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tài khoản
          </label>
          <input
            onChange={handleOnChange}
            type="text"
            name="taiKhoan"
            id="taiKhoan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nhập tài khoản"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="matKhau" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Mật Khẩu
          </label>
          <input
            onChange={handleOnChange}
            type="password"
            name="matKhau"
            id="matKhau"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Bạn chưa có tài khoản? {" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký tại đây
          </Link>
        </p>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 mt-4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Đăng nhập
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
