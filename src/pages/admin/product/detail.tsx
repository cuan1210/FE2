import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../../../inface/product";
import StarProduct from "../../client/item/rating";
import { Button } from "antd";
import { ICategory } from "../../../inface/category";
import { useState, useEffect } from "react";  // Import useState và useEffect

function Detail() {
    const params = useParams();
    const nav = useNavigate();

    // Sử dụng React Query để tải dữ liệu sản phẩm từ API
    const { data: product, isLoading } = useQuery<IProduct>({
        queryKey: ["products", params.id],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/products/${params.id}`);
                return data;
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                throw error;
            }
        },
    });

    const { data: categories = [] } = useQuery<ICategory[]>({
        queryKey: ["category"],
        queryFn: async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/category");
                return data;
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
                throw error;
            }
        },
    });

    const categoryName = categories.find((c: ICategory) => c.id === Number(product?.category))?.name || "Không xác định";

    // Thêm state để quản lý ảnh chính và ảnh album
    const [mainImage, setMainImage] = useState<string>("");

    // Album ảnh phụ (dữ liệu ảnh từ sản phẩm)
    const albumImages = product?.AblumImage || [];

    // Sử dụng useEffect để set ảnh chính ban đầu
    useEffect(() => {
        if (product) {
            setMainImage(product.image || "");  
        }
    }, [product]);

    // Hàm xử lý khi click vào ảnh phụ
    const handleImageClick = (image: string) => {
        setMainImage(image); 
    }

    if (isLoading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    if (!product) {
        return <div className="text-center py-12">Không tìm thấy sản phẩm!</div>;
    }

    return (
        <div className="px-4 md:px-24 py-12 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Phần hiển thị hình ảnh sản phẩm */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Hình ảnh phụ (các góc khác của sản phẩm) */}
                    <div className="flex flex-row md:flex-col gap-4 order-2 md:order-1">
                        {albumImages.map((image, index) => (
                            <img
                            key={index}
                            alt={`Product View ${index + 1}`}
                            className="w-24 h-24 min-w-[96px] min-h-[96px] object-contain bg-gray-100 p-2 rounded cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110"
                            src={image}
                            onClick={() => handleImageClick(image)}  
                            />
                        ))}
                    </div>
                    {/* Hình ảnh chính */}
                    <div className="order-1 md:order-2">
                        <img
                            src={mainImage}  
                            alt="Product Main"
                            className="w-full h-full md:h-[500px] object-contain bg-gray-100 ml-6 rounded "
                        />
                    </div>
                </div>

                {/* Phần hiển thị thông tin sản phẩm */}
                <div className="flex flex-col gap-4 bg-red-50 p-2 rounded-lg shadow-md">
                    <h1 className="text-3xl font-semibold mb-4">Thông Tin Sản Phẩm</h1>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Tên sản phẩm */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700">Tên sản phẩm:</label>
                            <p className="text-lg text-gray-900">{product.name}</p>
                        </div>

                        {/* Đánh giá sản phẩm */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Đánh giá:</label>
                            <div className="flex items-center gap-2">
                                <StarProduct score={product.rating || 0} />
                                <span className="text-gray-600">({product.rating || 0} / 5)</span>
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Trạng thái:</label>
                            <p className="text-lg text-green-600 font-semibold">
                                {product.status ? "Còn hàng" : "Hết hàng"}
                            </p>
                        </div>

                        {/* Giá */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Giá:</label>
                            <p className="text-lg text-gray-900">${product.price}</p>
                        </div>

                        {/* Danh mục */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Danh mục:</label>
                            <p className="text-lg text-gray-900">{categoryName}</p>
                        </div>

                        {/* Mô tả */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Mô tả:</label>
                            <p className="text-lg text-gray-900">{product.description}</p>
                        </div>

                        <hr className="my-4" />

                        {/* Màu sắc sản phẩm */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Màu sắc:</label>
                            <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: product.coler || "white" }}
                            />
                            <p className="text-lg text-gray-900">{product.coler || "Không xác định"}</p>
                        </div>

                        {/* Kích thước sản phẩm */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Kích thước:</label>
                            <p className="text-lg text-gray-900">{product.size || "Không xác định"}</p>
                        </div>

                        {/* Số lượng sản phẩm */}
                        <div className="flex items-center gap-4">
                            <label className="text-xl font-semibold text-gray-700 w-32">Số lượng:</label>
                            <p className="text-lg text-gray-900">{product.quantity || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Nút quay lại trang danh sách sản phẩm */}
                <div className="absolute bottom-1 right-4 ">
                    <Button className="text-lg" type="primary" onClick={() => nav(`/admin/list`)}>
                        Quay lại danh sách sản phẩm
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Detail
