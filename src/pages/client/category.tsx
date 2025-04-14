import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IProduct } from "../../inface/product";
import ItemProduct from "./item/product";
import { Pagination } from "antd";

const Category = () => {
    const { id } = useParams<{ id: string }>(); // Lấy id từ URL

    const [category, setCategory] = useState<any | null>(null); // Lưu danh mục
    const [products, setProducts] = useState<IProduct[]>([]); // Lưu sản phẩm
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    // Thông số phân trang
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1); // Lưu trang hiện tại

    useEffect(() => {
        // Lấy danh mục theo ID
        axios.get(`http://localhost:3000/category/${id}`)
            .then(response => setCategory(response.data))
            .catch(error => {
                console.error("Error fetching category", error);
                setIsError(true);
            });

        // Lấy sản phẩm theo categoryId
        axios.get(`http://localhost:3000/products?category=${id}`)
            .then(response => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products", error);
                setIsError(true);
                setIsLoading(false);
            });
    }, [id]); 

    // Hàm để thay đổi trang
    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Lấy các sản phẩm cho trang hiện tại
    const displayedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading products</div>;

    return (
        <div className="">
            <div className="py-4">
                <h2 className="text-2xl font-semibold mb-4 px-24">
                    Sản phẩm trong danh mục: {category?.name}
                </h2>
                <div className="grid grid-cols-4 gap-6 px-24 pt-4">
                    {/* {displayedProducts.map((product) => (
                        <ItemProduct key={product.id} products={product} />
                    ))} */}
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <ItemProduct key={product.id} products={product} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">
                            Không có sản phẩm nào trong danh mục này.
                        </p>
                    )}
                </div>

                {/* Phân trang */}
                <div className="flex justify-center items-center mt-6 space-x-2 mb-4">
                    <Pagination
                        current={currentPage}
                        total={products.length}
                        pageSize={itemsPerPage}
                        onChange={onPageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>  
        </div>
    );
};

export default Category
