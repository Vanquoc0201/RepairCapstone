import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
  const navigate = useNavigate(); // Hook để điều hướng
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    hoTen: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user submit", user);
    try {
      const result = await api.post("QuanLyNguoiDung/DangKy", user);
      console.log("result", result);
      toast.success("Đăng ký thành công", {
        position: "bottom-right",
      });

      // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Chờ 2 giây để hiển thị toast trước khi chuyển trang
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.content, {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <h1>RegisterPage</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label htmlFor="taiKhoan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tài khoản
          </label>
          <input
            onChange={handleOnChange}
            name="taiKhoan"
            type="text"
            id="taiKhoan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tài khoản"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="matKhau" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Mật khẩu
          </label>
          <input
            onChange={handleOnChange}
            name="matKhau"
            type="password"
            id="matKhau"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            onChange={handleOnChange}
            name="email"
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@gmail.com"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="soDt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Số điện thoại
          </label>
          <input
            onChange={handleOnChange}
            name="soDt"
            type="number"
            id="soDt"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="hoTen" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Họ Tên
          </label>
          <input
            onChange={handleOnChange}
            name="hoTen"
            type="text"
            id="hoTen"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Họ tên"
          />
        </div>
        {/* Thêm liên kết tới trang đăng nhập */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 mt-4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
