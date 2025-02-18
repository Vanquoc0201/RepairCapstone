import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSystem,
  setSelectedCluster,
  fetchCinemasAndShowtimes,
} from "./cinemaSlice";

const CinemaSelection = ({
  cinemaSystems,
  selectedSystem,
  selectedCluster,
}) => {
  const dispatch = useDispatch();
  const cinemaClusters = useSelector(
    (state) => state.cinemaReducer.cinemaClusters
  );
  const showtimes = useSelector((state) => state.cinemaReducer.showtimes);

  useEffect(() => {
    dispatch(fetchCinemasAndShowtimes());
  }, [dispatch]);

  // Lọc danh sách cụm rạp theo hệ thống rạp đã chọn
  const filteredClusters = selectedSystem
    ? cinemaClusters.filter(
        (cluster) => cluster.maHeThongRap === selectedSystem
      )
    : [];

  return (
    <div className="container mx-auto mt-5 grid grid-cols-3 gap-5">
      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-5">Hệ thống rạp</h1>
        <div className="flex flex-col gap-4">
          {cinemaSystems.map((system) => (
            <button
              key={system.maHeThongRap}
              className={`px-4 py-2 rounded-lg border ${
                selectedSystem === system.maHeThongRap
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => {
                dispatch(setSelectedSystem(system.maHeThongRap));
                dispatch(setSelectedCluster(null)); // Reset cụm rạp khi chọn hệ thống mới
              }}
            >
              {system.tenHeThongRap}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-5">Cụm rạp</h2>
        <ul className="space-y-3">
          {filteredClusters.length > 0 ? (
            filteredClusters.map((cluster) => (
              <li
                key={cluster.maCumRap}
                className={`p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200 ${
                  selectedCluster === cluster.maCumRap ? "bg-blue-300" : ""
                }`}
                onClick={() => dispatch(setSelectedCluster(cluster.maCumRap))}
              >
                <h3 className="font-semibold">{cluster.tenCumRap}</h3>
                <p className="text-sm text-gray-600">{cluster.diaChi}</p>
              </li>
            ))
          ) : (
            <p>Chọn hệ thống rạp để xem cụm rạp</p>
          )}
        </ul>
      </div>

        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-5">Suất chiếu</h2>
            {selectedCluster ? (
            <ul className="space-y-4">
                {showtimes[selectedCluster]?.map((movie) => (
                <li
                    key={movie.maPhim}
                    className="p-3 bg-white rounded-lg shadow-md"
                >
                    <h3 className="text-lg font-bold">{movie.tenPhim}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                    {movie.suatChieu.map((suat, index) => (
                        <span
                        key={index}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                        >
                        {new Date(suat).toLocaleString("vi-VN")}
                        </span>
                    ))}
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p>Chọn cụm rạp để xem suất chiếu</p>
            )}
        </div>
    </div>
  );
};

export default CinemaSelection;
