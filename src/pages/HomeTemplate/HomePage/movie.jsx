import { Link } from "react-router-dom";
/* eslint-disable react/prop-types */
export default function Movie({ movie }) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg h-3/5 w-3/5" src={movie.hinhAnh} />
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {movie.tenPhim}
          </h5>
        </a>
      </div>
      <Link
        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        to={`/detail/${movie.maPhim}`}
      >
        Xem chi tiết
      </Link>
    </div>
  );
}
