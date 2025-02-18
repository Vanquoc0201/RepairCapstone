import React, { useState, useEffect } from 'react';
import './style.scss';
import { setSeatSelected } from './slice';
import { useDispatch, useSelector } from 'react-redux';

export default function Seat({ seat }) {
  const dispatch = useDispatch();

  // Lấy danh sách ghế đã chọn từ Redux store
  const listSeatsSelected = useSelector((state) => state.bookingTicketReducer.listSeatsSelected);


  // Kiểm tra xem ghế này đã được chọn hay chưa
  const [isChoosing, setIsChoosing] = useState(false);

  // Cập nhật trạng thái 'isChoosing' mỗi khi danh sách ghế đã chọn thay đổi
  useEffect(() => {
    const isSeatSelected = listSeatsSelected.some((selectedSeat) => selectedSeat.stt === seat.stt);
    setIsChoosing(isSeatSelected);
  }, [listSeatsSelected, seat.stt]);

  const handleSeatClick = () => {
    if (!seat.daDat) {
      setIsChoosing(!isChoosing);
      dispatch(setSeatSelected(seat)); // Gửi ghế vào Redux khi người dùng chọn hoặc bỏ chọn ghế
    }
  };

  return (
    <button
      disabled={seat.daDat}
      onClick={handleSeatClick}
      className={`seat ${seat.daDat ? 'seatSold' : ''} ${isChoosing ? 'seatChoosing' : ''}`}
      style={{
        width: '50px', // Tăng kích thước của ghế
        height: '50px', // Tăng chiều cao
        fontSize: '18px', // Tăng kích thước chữ bên trong ghế
        margin: '10px', // Tăng khoảng cách giữa các ghế
      }}
    >
      {seat.stt} {/* Hiển thị số ghế */}
    </button>
  );
  
}
