import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Async thunk lấy danh sách hệ thống rạp
export const fetchCinemaSystems = createAsyncThunk(
  "cinema/fetchCinemaSystems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi lấy hệ thống rạp");
    }
  }
);

// Fetch danh sách cụm rạp và suất chiếu từ API
export const fetchCinemasAndShowtimes = createAsyncThunk(
  "cinema/fetchCinemasAndShowtimes",
  async (maNhom = "GP01", { rejectWithValue }) => {
    try {
      const response = await api.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${maNhom}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi lấy dữ liệu cụm rạp và lịch chiếu");
    }
  }
);

// API lấy lịch chiếu phim theo mã phim
export const fetchShowtimesByMovie = createAsyncThunk(
  "cinema/fetchShowtimesByMovie",
  async (maPhim, { rejectWithValue }) => {
    try {
      const response = await api.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi lấy lịch chiếu phim");
    }
  }
);

// Lấy dữ liệu từ localStorage
const getLocalStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

const initialState = {
  loading: false,
  error: null,
  cinemaSystems: [],
  cinemaClusters: [],
  showtimes: {},
  movieShowtimes: {},
  selectedSystem: getLocalStorage("selectedSystem", null), 
  selectedCluster: getLocalStorage("selectedCluster", null), 
  selectedShowtime: null,
};

const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {
    setSelectedSystem: (state, action) => {
      state.selectedSystem = action.payload;
      state.selectedCluster = null; // Reset cụm rạp khi đổi hệ thống rạp
      localStorage.setItem("selectedSystem", JSON.stringify(action.payload));
      localStorage.removeItem("selectedCluster"); // Xóa cụm rạp cũ
    },
    setSelectedCluster: (state, action) => {
      state.selectedCluster = action.payload;
      localStorage.setItem("selectedCluster", JSON.stringify(action.payload));
    },
    resetCinemaSelection: (state) => {
      state.selectedSystem = null;
      state.selectedCluster = null;
      state.cinemaClusters = [];
      state.showtimes = {};
      state.movieShowtimes = {};
      state.selectedShowtime = null;
      localStorage.removeItem("selectedSystem");
      localStorage.removeItem("selectedCluster");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCinemaSystems.fulfilled, (state, action) => {
        state.cinemaSystems = action.payload;

        // Nếu danh sách hệ thống rạp không rỗng, cho phép chọn lại từ đầu
        if (action.payload.length > 0) {
          state.selectedSystem = null;
          state.selectedCluster = null;
          localStorage.removeItem("selectedSystem");
          localStorage.removeItem("selectedCluster");
        }
      })
      .addCase(fetchCinemasAndShowtimes.fulfilled, (state, action) => {
        const clusters = [];
        const showtimesData = {};

        action.payload.forEach((heThongRap) => {
          heThongRap.lstCumRap.forEach((cumRap) => {
            clusters.push({
              maCumRap: cumRap.maCumRap,
              tenCumRap: cumRap.tenCumRap,
              diaChi: cumRap.diaChi,
              maHeThongRap: heThongRap.maHeThongRap,
            });

            showtimesData[cumRap.maCumRap] = cumRap.danhSachPhim.map((phim) => ({
              maPhim: phim.maPhim,
              tenPhim: phim.tenPhim,
              suatChieu: phim.lstLichChieuTheoPhim.map((lich) => lich.ngayChieuGioChieu),
            }));
          });
        });

        state.cinemaClusters = clusters;
        state.showtimes = showtimesData;

        // Xóa cụm rạp đã chọn trước đó khi hệ thống rạp được load lại
        state.selectedCluster = null;
        localStorage.removeItem("selectedCluster");
      })
      .addCase(fetchShowtimesByMovie.fulfilled, (state, action) => {
        state.movieShowtimes = action.payload;
      });
  },
});



export const { setSelectedSystem, setSelectedCluster, resetCinemaSelection, setSelectedShowtime } = cinemaSlice.actions;
export default cinemaSlice.reducer;
