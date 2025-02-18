import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api"
export const fetchDetailMovie = createAsyncThunk(
    "detailMoviePage/fetchDetailMovie",
    async (id, { rejectWithValue }) => {
      try {
        const result = await api.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`);
  
        if (!result.data) {
          throw new Error("No data received from API");
        }
  
        return result.data.content || result.data; // Kiểm tra nếu content null thì return toàn bộ data
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


const initialState = {
    loading:false,
    data:null,
    error: null,
}
const detailMoviePageSlice = createSlice({
    name: "detailMoviePageSlice",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchDetailMovie.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(fetchDetailMovie.fulfilled,(state,action)=>{
            state.data = action.payload;
            state.loading = false
        });
        builder.addCase(fetchDetailMovie.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload
        });
    }
})
export default detailMoviePageSlice.reducer
