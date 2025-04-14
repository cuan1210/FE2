import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../inface/order";
import { useCartContext } from "../../../conText/cartContext";
import { ICartProduct, TypeCart } from "../../../inface/cart";
import { useAuth } from "../../../conText/authContext";
import { message } from "antd";

const OrderClient = () => {
  const navigate = useNavigate();
  const { cartstate, dispatch  } = useCartContext();
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod", // mặc định là COD
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra xem userId có tồn tại hay không
    if (!userId) {
      message.warning("Vui lòng đăng nhập trước khi đặt hàng.");
      return;
    }
  
    const items = cartstate.carts.map((item: ICartProduct) => ({
      productId: item.productId.id,
      quantity: item.quantity,
    }));
  
    const order: Order = {
      userId: userId as number, // Lấy userId từ Context
      ...formData,
      items,
    };
  
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Thêm Authorization header với token
        },
        body: JSON.stringify(order),
      });
  
      if (res.ok) {
        const cartId = userId; // dùng đúng ID trong db.json
        console.log(cartId);
        
        // Xóa giỏ hàng trong db.json
        await fetch(`http://localhost:3000/carts/${cartId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            Items: [] // xóa toàn bộ sau khi đặt hàng
          })
        });
        
        // Cập nhật context rỗng luôn
        dispatch({ type: TypeCart.updateCart, payload: [] });
        
      
        message.success("Đặt hàng thành công!");
        navigate('/order');
      } else {
        const result = await res.json();
        message.error(result.message || "Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      message.warning("Đặt hàng thất bại!");
    }
  };
  
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Đặt hàng</h2>
  
      {/* Bố cục 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cột trái: Sản phẩm trong giỏ hàng */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sản phẩm trong giỏ hàng</h3>
          {cartstate.carts.length === 0 ? (
            <p className="text-red-500">Giỏ hàng trống.</p>
          ) : (
            <div className="border rounded overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Ảnh</th>
                    <th className="p-3">Tên</th>
                    <th className="p-3">SL</th>
                    <th className="p-3">Giá</th>
                    <th className="p-3">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartstate.carts.map((item: ICartProduct) => (
                    <tr key={item.productId.id} className="border-t">
                      <td className="p-3">
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">{item.productId.name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{item.productId.price.toLocaleString()}₫</td>
                      <td className="p-3 font-semibold">
                        {(item.productId.price * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
  
        {/* Cột phải: Form đặt hàng */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div>
            <label className="block font-semibold mb-1">Tên người nhận *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Địa chỉ *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-2">Phương thức thanh toán *</label>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Thanh toán khi nhận hàng
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Thanh toán online
              </label>
            </div>
          </div>
  
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
            >
              Quay về giỏ hàng
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Đặt hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default OrderClient;
