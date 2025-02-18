import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import Movie from "./movie";
import { fetchListMovie, setFilter, selectFilteredMovies } from "./slice";
import CinemaSelection from "./cinema";
import { fetchCinemaSystems, fetchCinemasAndShowtimes, resetCinemaSelection } from "./cinemaSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HomePage() {
  const dispatch = useDispatch();

  // Lấy danh sách phim & bộ lọc từ Redux
  const { loading: loadingMovies, selectedFilter } = useSelector(
    (state) => state.listMovieReducer
  );
  const filteredMovies = useSelector(selectFilteredMovies);

  // Lấy danh sách rạp từ Redux
  const {
    cinemaSystems = [],
    cinemaClusters = [],
    selectedSystem,
    selectedCluster,
    showtimes,
    loading: loadingCinemas,
  } = useSelector((state) => state.cinemaReducer || {});
  
  useEffect(() => {
    // Reset hệ thống rạp trước khi fetch dữ liệu
    dispatch(resetCinemaSelection());
  
    // Sau khi reset, gọi API lấy danh sách phim & hệ thống rạp
    dispatch(fetchListMovie());
    dispatch(fetchCinemaSystems());
  }, [dispatch]);
  
  // Gọi API suất chiếu khi cụm rạp thay đổi
  useEffect(() => {
    if (selectedCluster) {
      dispatch(fetchCinemasAndShowtimes(selectedCluster));
    }
  }, [selectedCluster, dispatch]);

  // Lọc danh sách cụm rạp theo hệ thống rạp được chọn
  const filteredClusters = useMemo(() => {
    if (!selectedSystem || !cinemaClusters.length) return [];
    return cinemaClusters.filter(
      (cluster) => cluster.maHeThongRap === selectedSystem
    );
  }, [cinemaClusters, selectedSystem]);

  // Danh sách bộ lọc phim
  const filters = useMemo(
    () => [
      { key: "all", label: "🎥 Tất cả" },
      { key: "dangChieu", label: "🎬 Đang chiếu" },
      { key: "sapChieu", label: "⏳ Sắp chiếu" },
      { key: "hot", label: "🔥 Phim HOT" },
    ],
    []
  );

  return (
    <div className="container mx-auto mt-5">
      {/* Banner */}
      <div className="mb-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="rounded-lg shadow-lg"
        >
          {loadingMovies ? (
            <p className="text-center text-gray-500">Đang tải phim...</p>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.slice(0, 10).map((movie) => (
              <SwiperSlide key={movie.maPhim} className="relative">
                <div className="relative w-full h-[400px]">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="max-w-[90%] h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg"></div>
                  <div className="absolute bottom-5 left-5 text-white">
                    <h2 className="text-3xl font-bold">{movie.tenPhim}</h2>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Không có phim nào để hiển thị.
            </p>
          )}
        </Swiper>
      </div>

      {/* Thanh lọc phim */}
      <div className="flex justify-center gap-5 mb-8">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedFilter === key
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
            onClick={() => dispatch(setFilter(key))}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Danh sách phim */}
      <h1 className="text-2xl font-bold mb-5">Danh sách phim</h1>
      <div className="grid grid-cols-4 gap-5">
        {loadingMovies ? (
          <p>Đang tải phim...</p>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Movie key={movie.maPhim} movie={movie} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            Không có phim nào được tìm thấy.
          </p>
        )}
      </div>

      {/* Hệ thống rạp */}
      <CinemaSelection
        cinemaSystems={cinemaSystems}
        selectedSystem={selectedSystem}
        cinemaClusters={filteredClusters} // Chỉ hiển thị cụm rạp đã lọc
        selectedCluster={selectedCluster}
        showtimes={showtimes}
        loadingCinemas={loadingCinemas}
      />
    </div>
  );
}
