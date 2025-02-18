import { fetchDetailMovie } from "./slice";
import { fetchCinemasAndShowtimes, setSelectedSystem, setSelectedCluster } from "../HomePage/cinemaSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DetailMovie() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  
  const movieState = useSelector((state) => state.detailMovieReducer);
  const { cinemaSystems, cinemaClusters, showtimes, selectedSystem, selectedCluster, loading } = useSelector((state) => state.cinemaReducer);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [maLichChieu, setMaLichChieu] = useState(null);  // State lưu mã lịch chiếu

  useEffect(() => {
    dispatch(fetchDetailMovie(id));
    dispatch(fetchCinemasAndShowtimes());
  }, [dispatch, id]);

  if (movieState.loading || loading) return <p>Loading...</p>;
  if (!movieState.data) return <p>Không tìm thấy phim!</p>;

  const { data } = movieState;
  
  // Tìm tất cả các suất chiếu của phim theo id
  const availableShowtimes = Object.values(showtimes).flatMap((clusters) =>
    clusters.filter((phim) => phim.maPhim === Number(id)).flatMap((phim) => phim.suatChieu)
  );

  const handleSelectShowtime = (lich) => {
    // Kiểm tra giá trị 'lich' xem có khớp với dữ liệu không
    console.log("Selected Lich:", lich);
  
    // Tìm suất chiếu khớp với lich được chọn
    const selected = availableShowtimes.find((item) => {
      const itemDate = new Date(item.ngayChieuGioChieu).toLocaleString("vi-VN"); // Chuyển cả hai về định dạng chung để so sánh
      const lichDate = new Date(lich).toLocaleString("vi-VN");
      return itemDate === lichDate; // So sánh thời gian của lịch chiếu
    });
  
    if (selected) {
      setSelectedShowtime(lich);  // Lưu lịch chiếu đã chọn
      setMaLichChieu(selected.maLichChieu);  // Lưu mã lịch chiếu
      console.log("Ma Lich Chieu:", selected.maLichChieu);
    } else {
      console.log("Không tìm thấy suất chiếu tương ứng.");
    }
  };
  

  return (
    <div className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-6 uppercase">
          {data.tenPhim}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <img className="rounded-lg shadow-lg w-full max-w-sm" src={data.hinhAnh} alt={data.tenPhim} />
          </div>
          <div className="md:col-span-2 space-y-6 ">
            <p className="text-lg">{data.moTa}</p>
            <p>🎬 <strong>Ngày khởi chiếu:</strong> {new Date(data.ngayKhoiChieu).toLocaleDateString("vi-VN")}</p>
            <p>⭐ <strong>Đánh giá:</strong> {data.danhGia}/10</p>
            <Link
              to={maLichChieu ? `/booking/${maLichChieu}` : "#"}
              className={`px-3 text-lg font-bold rounded-lg shadow-md transition-all ${maLichChieu ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 cursor-not-allowed"}`}
            >
              🎟 Mua vé ngay
            </Link>
          </div>
        </div>

        {/* Chọn hệ thống rạp */}
        <div className="mt-10 bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Chọn Hệ Thống Rạp</h2>
          <div className="grid grid-cols-3 gap-4">
            {cinemaSystems.map((system) => (
              <button
                key={system.maHeThongRap}
                className={`p-3 rounded-md text-center ${selectedSystem === system.maHeThongRap ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"}`}
                onClick={() => dispatch(setSelectedSystem(system.maHeThongRap))}
              >
                {system.tenHeThongRap}
              </button>
            ))}
          </div>
        </div>

        {/* Chọn cụm rạp */}
        {selectedSystem && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Chọn Cụm Rạp</h2>
            <div className="grid grid-cols-3 gap-4">
              {cinemaClusters.filter((cluster) => cluster.maHeThongRap === selectedSystem).map((cluster) => (
                <button
                  key={cluster.maCumRap}
                  className={`p-3 rounded-md text-center ${selectedCluster === cluster.maCumRap ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"}`}
                  onClick={() => dispatch(setSelectedCluster(cluster.maCumRap))}
                >
                  {cluster.tenCumRap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị lịch chiếu */}
        {selectedCluster && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Lịch Chiếu</h2>
            <div className="grid grid-cols-2 gap-4">
              {showtimes[selectedCluster]
                ?.filter((phim) => phim.maPhim === Number(id))
                .flatMap((phim) =>
                  phim.suatChieu.map((lich, index) => (
                    <button
                      key={index}
                      className={`p-3 rounded-md text-center ${selectedShowtime === lich ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"}`}
                      onClick={() => handleSelectShowtime(lich)}
                    >
                      {new Date(lich).toLocaleDateString("vi-VN")} - {new Date(lich).toLocaleTimeString("vi-VN")}
                    </button>
                  ))
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
