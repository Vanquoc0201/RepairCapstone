import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";
import { createSelector } from "reselect";

const selectMovieState = (state) => state.listMovieReducer;

// Async action để lấy danh sách phim
export const fetchListMovie = createAsyncThunk(
  "listMoviePage/fetchListMovie",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
  selectedFilter: "all", // Lưu filter
  selectedMovie: null,   // Lưu bộ phim đang chọn
};

const listMoviePageSlice = createSlice({
  name: "listMoviePageSlice",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchListMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selector để lấy danh sách phim đã lọc
export const selectFilteredMovies = createSelector(
  [selectMovieState],
  (movieState) => {
    const { data, selectedFilter } = movieState;
    if (!data || data.length === 0) return [];

    return data.filter((movie) => {
      switch (selectedFilter) {
        case "dangChieu": return movie.dangChieu;
        case "sapChieu": return movie.sapChieu;
        case "hot": return movie.hot;
        default: return true;
      }
    });
  }
);

export const { setFilter, setSelectedMovie } = listMoviePageSlice.actions;
export default listMoviePageSlice.reducer;
