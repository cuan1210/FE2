import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../conText/authContext";
import { IProduct } from "../../../inface/product";

interface IOrder {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
  items: {
    productId: IProduct;
    quantity: number;
  }[];
}

function OrderHistory() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { userId } = useContext(AuthContext); // lấy userId từ context

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const { data } = await axios.get(`http://localhost:3000/orders?userId=${userId}`, config);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Đơn hàng #{order.id}</h2>
              <p><strong>Người nhận:</strong> {order.name}</p>
              <p><strong>SĐT:</strong> {order.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.address}</p>
              <p><strong>Ghi chú:</strong> {order.note}</p>
              <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
              <h3 className="mt-4 font-medium">Sản phẩm:</h3>
              <ul className="pl-4 list-disc">
                {order.items.map((item, index) => (
                  <li key={index}>
                    <div className="flex items-center gap-2">
                      <img src={item.productId.image} alt={item.productId.name} className="w-12 h-12 object-cover" />
                      <span>{item.productId.name} - SL: {item.quantity} - Giá: {item.productId.price}đ</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
