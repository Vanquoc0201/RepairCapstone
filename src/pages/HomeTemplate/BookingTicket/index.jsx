import React, { useEffect } from "react";
import Seat from "./Seat";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSeats } from "./slice";
import { toast, ToastContainer } from "react-toastify";

export default function BookingTicket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { listSeats, listSeatsSelected, status, error, thongTinPhim } =
    useSelector((state) => state.bookingTicketReducer);
    const handleBooking = () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) {
        toast.warning("Bạn chưa đăng nhập. Bạn có muốn đăng nhập không?", {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            if (
              window.confirm("Bạn chưa đăng nhập. Bạn có muốn đăng nhập không?")
            ) {
              navigate("/login");
            }
          },
        });
      } else {
        // Nếu đã đăng nhập, cập nhật các ghế đã chọn
        console.log("Đặt vé thành công!");
        
        // Thay đổi màu ghế đã chọn thành đỏ (đã đặt)
        const updatedSeats = listSeats.map((seat) => {
          if (listSeatsSelected.some((selected) => selected.stt === seat.stt)) {
            return { ...seat, status: "booked" };  // Đánh dấu ghế là đã đặt
          }
          return seat;
        });
    
        // Cập nhật lại danh sách ghế đã chọn và trạng thái
        dispatch({
          type: 'UPDATE_SEATS',  // Tạo action để cập nhật ghế trong Redux store (nếu dùng Redux)
          payload: updatedSeats,
        });
        
        // Hiển thị thông báo đặt vé thành công (tùy chọn)
        toast.success("Đặt vé thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };
    
    

  useEffect(() => {
    if (id) {
      dispatch(fetchSeats(id));
    }
  }, [id, dispatch]);

  if (status === "loading") return <p>Đang tải danh sách ghế...</p>;
  if (status === "failed") return <p>Lỗi: {error}</p>;

  const renderListSeats = () => {
    if (!listSeats || listSeats.length === 0) return null;

    // Giả sử mỗi hàng có tối đa 10 ghế
    const seatsPerRow = 10;

    // Chia danh sách ghế thành các hàng
    const rows = [];
    for (let i = 0; i < listSeats.length; i += seatsPerRow) {
      rows.push(listSeats.slice(i, i + seatsPerRow));
    }

    return rows.map((row, index) => (
      <div key={index} className="flex items-center space-x-4 mb-4">
        <span>Hàng {index + 1}</span> {/* Hiển thị tên hàng ghế */}
        {row.map((seat) => (
          <Seat key={seat.stt} seat={seat} /> // Render từng ghế trong hàng
        ))}
      </div>
    ));
  };

  // Tính tổng giá trị của các ghế đã chọn
  const totalPrice = () => {
    return listSeatsSelected.reduce((total, seat) => total + seat.giaVe, 0);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-6 text-blue-600">
        Booking Ticket Online
      </h1>
      <div className="flex justify-between space-x-8">
        {/* Bên trái - Danh sách ghế */}
        <div className="w-3/4 p-6 border border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Chọn ghế</h2>
          {renderListSeats()} {/* Chỉ hiển thị danh sách ghế */}
          {/* Phần chú thích về màu ghế */}
          <div className="mt-6 text-gray-800">
            <h3 className="font-semibold mb-2">Chú thích màu ghế:</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>{" "}
                {/* Màu đỏ */}
                <span>Đã chọn</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>{" "}
                {/* Màu xanh */}
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white border border-gray-300 rounded-full"></div>{" "}
                {/* Màu trắng */}
                <span>Còn trống</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bên phải - Thông tin phim */}
        <div className="w-1/4 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
          {thongTinPhim && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {thongTinPhim.tenPhim}
              </h2>
              <p className="text-gray-600">
                <strong>Cụm rạp:</strong> {thongTinPhim.tenCumRap} -{" "}
                {thongTinPhim.tenRap}
              </p>
              <p className="text-gray-600">
                <strong>Địa chỉ:</strong> {thongTinPhim.diaChi}
              </p>
              <p className="text-gray-600">
                <strong>Ngày chiếu:</strong> {thongTinPhim.ngayChieu}
              </p>
              <p className="text-gray-600">
                <strong>Giờ chiếu:</strong> {thongTinPhim.gioChieu}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">Ghế đã chọn:</h3>
                <div className="space-y-2">
                  {listSeatsSelected.map((seat) => (
                    <div key={seat.stt} className="flex justify-between">
                      <span className="text-gray-700">Ghế {seat.stt}</span>
                      <span className="text-gray-700">
                        Giá: {seat.giaVe} VND
                      </span>
                    </div>
                  ))}
                </div>
                <div className="font-bold text-lg mt-4">
                  Tổng giá trị:{" "}
                  <span className="text-red-600">{totalPrice()} VND</span>
                </div>
              </div>

              {/* Nút Đặt vé */}
              <div className="mt-6">
                <button
                  onClick={handleBooking}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Đặt vé
                </button>
                <ToastContainer />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
