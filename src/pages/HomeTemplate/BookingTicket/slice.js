import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Async thunk để gọi API lấy danh sách ghế
export const fetchSeats = createAsyncThunk(
    "bookingTicket/fetchSeats",
    async (maLichChieu, { rejectWithValue }) => {
        try {
            const response = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`);
            return response.data.content; 
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);
// Async thunk gọi API để booking vé
export const fetchBookingTicket = createAsyncThunk("bookingTicket/fetchBookingTicket", async (bearer, {rejectWithValue})=>{
    try {
        const result = await api.post(`QuanLyDatVe/DatVe`, bearer);
        console.log(result.data.content);
        return result.data.content;
    } catch (error){
        return rejectWithValue(error.response?.data || "Lỗi không xác định")
    }
})

// Trạng thái ban đầu
const initialState = {
    listSeats: null, // Chờ API trả dữ liệu
    listSeatsSelected: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
};

// Tìm vị trí ghế trong danh sách
const findIndexSeat = (data, numberSeat) => {
    return data.findIndex((seat) => seat.stt === numberSeat); // Sử dụng 'stt' thay vì 'soGhe'
};

// Slice quản lý đặt vé
const bookingTicketSlice = createSlice({
    name: "bookingTicketSlice",
    initialState,
    reducers: {
        setSeatSelected: (state, action) => {
            const { payload } = action;
            if (!state.listSeats) return; // Đảm bảo API đã tải xong
            
            // Tìm kiếm ghế đã chọn bằng 'stt' thay vì 'soGhe'
            const index = findIndexSeat(state.listSeatsSelected, payload.stt);
            if (index !== -1) {
                // Bỏ chọn ghế nếu đã chọn
                state.listSeatsSelected = state.listSeatsSelected.filter(seat => seat.stt !== payload.stt);
            } else {
                // Thêm ghế vào danh sách đã chọn
                state.listSeatsSelected.push(payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSeats.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchSeats.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listSeats = action.payload.danhSachGhe; // Lưu danh sách ghế
                state.thongTinPhim = action.payload.thongTinPhim; // Lưu thông tin phim
            })
            .addCase(fetchSeats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Xuất reducers và actions
export const { setSeatSelected } = bookingTicketSlice.actions;
export default bookingTicketSlice.reducer;
