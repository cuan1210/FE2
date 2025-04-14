import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const dataProvider = {
  // Lấy danh sách giỏ hàng
  ListCart: async (route: string) => {
    return await api.get(route);
  },

  // Cập nhật sản phẩm trong giỏ hàng (ví dụ: số lượng)
  updateCart: async <T>(resource: { route: string; data: T; id: number | string }) => {
    return await api.put(`${resource.route}/${resource.id}`, resource.data);
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (route: string, id: number | string) => {
    return await api.delete(`${route}/${id}`);
  },

  // Clear giỏ hàng
  clearCart: async (route: string) => {
    return await api.delete(route); // Xóa tất cả các sản phẩm trong giỏ hàng
  }
};

export const { ListCart, updateCart, removeFromCart, clearCart } = dataProvider;
