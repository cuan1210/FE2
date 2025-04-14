import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListData } from "../../services/data";
import { IProduct } from "../../inface/product";
import ItemProduct from "./item/product";

const Search = () => {
    const [search] = useSearchParams();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [keyword, setKeyword] = useState<string>("");

    useEffect(() => {
        const keywordFromURL = search.get("keyword") || "";
        setKeyword(keywordFromURL);

        const fetchProducts = async () => {
            try {
                const { data } = await ListData("products"); // Gọi toàn bộ sản phẩm
                const filtered = data.filter((product: IProduct) =>
                    product.name.toLowerCase().includes(keywordFromURL.toLowerCase())
                );
                setProducts(filtered);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchProducts();
    }, [search]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-center my-4">
                Kết quả tìm kiếm cho từ khóa: "{keyword}"
            </h1>
            <div className="grid grid-cols-4 gap-4 px-24 my-12">
                {products.length > 0 ? (
                    products.map((item: IProduct) => (
                        <ItemProduct key={item.id} products={item} />
                    ))
                ) : (
                    <p className="text-center col-span-4">
                        Không có sản phẩm nào phù hợp với từ khóa "{keyword}"
                    </p>
                )}
            </div>
        </div>
    );
};

export default Search;
