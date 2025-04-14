import { useQuery } from "@tanstack/react-query";
import { Statistic, Spin } from "antd";
import { FaUsers, FaBoxOpen } from "react-icons/fa";
import { api } from "../../services/data";

const fetchUsers = async () => {
  const { data } = await api.get("/users");
  return data.length;
};

const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data.length;
};

const ThongKe = () => {
  const { data: userCount, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: productCount, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        Thống kê tổng quan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <div className="flex justify-center items-center gap-2 mb-2 text-blue-500 text-2xl">
            <FaUsers />
            <span>Người dùng</span>
          </div>
          {loadingUsers ? <Spin tip="Đang tải dữ liệu..." size="small"/> : <Statistic value={userCount} />}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <div className="flex justify-center items-center gap-2 mb-2 text-green-500 text-2xl">
            <FaBoxOpen />
            <span>Sản phẩm</span>
          </div>
          {loadingProducts ? <Spin tip="Đang tải dữ liệu..." size="small" /> : <Statistic value={productCount} />}
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
