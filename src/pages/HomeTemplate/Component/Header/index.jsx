import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Login/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Lấy user từ Redux

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout()); // Xóa user trong Redux
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://www.cgv.vn/skin/frontend/cgv/default/images/cgvlogo.png"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-semibold dark:text-white">CGV Cinema</span>
        </Link>

        <div className="flex-1 flex justify-center">
          <ul className="font-medium flex space-x-8">
            <li>
              <Link to="/" className="text-gray-900 hover:text-blue-700 dark:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-900 hover:text-blue-700 dark:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-900 hover:text-blue-700 dark:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <img
                src="./public/images/avatar.jpg" 
                alt="User Avatar"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-900 dark:text-white">{user.taiKhoan}</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-900 hover:text-blue-700 dark:text-white">
                Đăng nhập
              </Link>
              <span>|</span>
              <Link to="/register" className="text-gray-900 hover:text-blue-700 dark:text-white">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
