import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../inface/product";
import { ListData } from "../../services/data";
import ItemProduct from "./item/product";
import { Pagination } from "antd";

const ProductClient = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4

    const { data = [], isLoading, isError } = useQuery<IProduct[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const { data: products } = await ListData("products");
            return products;
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading products</div>;

    // Lấy các sản phẩm cho trang hiện tại
    const displayedProducts = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Hàm để thay đổi trang
    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto">
            <div className="py-4">
                <h2 className="text-2xl font-semibold mb-4 px-24">Danh sách sản phẩm</h2>
                <div className="grid grid-cols-4 gap-6 px-24 pt-4">
                    {displayedProducts.map((product: IProduct) => (
                        <ItemProduct key={product.id} products={product} />
                    ))}
                </div>
            </div>  

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-6 space-x-2 mb-4">
                <Pagination
                    current={currentPage}
                    total={data.length}
                    pageSize={itemsPerPage}
                    onChange={onPageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default ProductClient
