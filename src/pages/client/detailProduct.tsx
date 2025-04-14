import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineEye, AiOutlineHeart, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BiSolidTruck } from "react-icons/bi";
import { MdOutlineAutorenew } from "react-icons/md";
import { IProduct } from "../../inface/product";
import StarProduct from "./item/rating";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function DetailProduct() {
    // Khởi tạo trạng thái cho sản phẩm và các giá trị liên quan
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const params = useParams();

    // Sử dụng React Query để tải dữ liệu sản phẩm từ API
    const { data: product } = useQuery<IProduct>({
        queryKey: ["products", params.id],
        queryFn: async () => {
            try {
                const { data} = await axios.get(`http://localhost:3000/products/${params.id}`);
                return data;
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        },
    });

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

        const products = [
            {
                name: "The north coat",
                image: "/src/assets/product1.png",
                price: 260,
                oldPrice: 360,
                padding: "p-10",
            },
            {
                name: "Gucci duffle bag",
                image: "/src/assets/product2.png",
                price: 960,
                oldPrice: 1160,
                padding: "p-12",
            },
            {
                name: "RGB liquid CPU cooler",
                image: "/src/assets/product3.png",
                price: 160,
                oldPrice: 170,
                padding: "p-14",
            },
            {
                name: "Small bookshelf",
                image: "/src/assets/product4.png",
                price: 360,
                oldPrice: null,
                padding: "p-14",
            },
        ];
    
    return (
        <>
            <div className="px-24 grid grid-cols-2 gap-10 my-12">
            {/* Phần hiển thị hình ảnh sản phẩm */}
            <div>
                <div className="flex gap-4">
                    {/* Hình ảnh phụ (các góc khác của sản phẩm) */}
                    <div className="flex flex-col gap-4">
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
                    <img
                        src={mainImage}
                        alt="Product Main"
                        className="w-full h-[500px] object-contain bg-gray-100 p-8 rounded transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            {/* Phần hiển thị thông tin sản phẩm */}
            <div className="ml-6">
                <h1 className="text-3xl font-semibold">{product?.name}</h1>
                {/* Hiển thị đánh giá sản phẩm */}
                <div className="flex items-center gap-2 my-2">
                    <StarProduct score={product?.rating || 0} />
                    <span className="text-gray-400">(150 Reviews)</span>
                    <span className="text-green-600 font-semibold">{product?.status}</span>
                </div>
                <p className="text-3xl font-semibold">${product?.price}</p>
                <p className="text-gray-600 mt-4 text-sm break-words">{product?.description || "Product description here..."}</p>

                <div className="mt-4">
                    <hr />
                </div>

                {/* Chọn màu sắc sản phẩm */}
                <div className="mt-6 flex items-center">
                    <p className="text-xl font-semibold text-gray-700">Colours:</p>
                    <div className="flex">
                            <div
                                className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer mx-1"
                                style={{ backgroundColor: product?.coler }}
                            ></div>
                    </div>
                </div>

                {/* Chọn kích thước sản phẩm */}
                <div className="mt-6">
                    <div className="flex items-center">
                        <p className="font-semibold text-gray-700 pr-4 text-xl">Size:</p>
                        <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-red-500 hover:text-white"
                                >
                                    {product?.size}
                                </button>
                        </div>
                    </div>
                </div>

                {/* Chọn số lượng sản phẩm */}
                <div className="mt-6 flex items-center">
                    <div className="flex border border-gray-300 rounded">
                        <button
                            className="px-3 py-1 hover:bg-red-500 hover:text-white border-r border-gray-300"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <AiOutlineMinus />
                        </button>
                        <p className="px-4 py-1">{quantity}</p>
                        <button
                            className="px-3 py-1 hover:bg-red-500 hover:text-white border-l border-gray-300"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <AiOutlinePlus />
                        </button>
                    </div>

                    <div className="flex gap-3 ml-4">
                        <button className="bg-red-500 text-white px-12 py-2 font-semibold rounded hover:bg-red-600">
                            Buy Now
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded hover:bg-red-600 hover:text-white">
                            <AiOutlineHeart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chính sách giao hàng */}
                <div className="mt-6 border border-gray-300 rounded-lg">
                    <div className="border-b p-4 flex items-center">
                        <BiSolidTruck className="w-6 h-6 text-gray-600" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold hover:underline">Free Delivery</p>
                            <p className="text-xs text-gray-600 hover:underline">
                                Enter your postal code for Delivery Availability
                            </p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center">
                        <MdOutlineAutorenew className="w-6 h-6 text-gray-600" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold hover:underline">Return Delivery</p>
                            <p className="text-xs text-gray-600 hover:underline">Free 30 Days Delivery Returns. Details</p>
                        </div>
                    </div>
                </div>
            </div>
            
            </div>
            
            <div className="py-4">
            <div className="flex items-center px-24">
                <div className=" bg-red-500 w-[30px] rounded-lg h-[50px]">
                
                </div>
                <h3 className="p-2 text-red-500 font-bold">Related Item</h3>
            </div>

            <div className="">
                <div>
                    <div className="grid grid-cols-4 gap-6 px-24 pt-4">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white">
                                <div className="relative bg-gray-100 icon-container">
                                    <Link to={'category'}><img src={product.image} alt={product.name} className={`w-60 h-60 object-cover mx-auto ${product.padding}`} /></Link>
                                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                                        <Link to={`/detail/${index}`}>
                                            <AiOutlineHeart className="w-9 h-9 rounded-full bg-white p-2" />
                                        </Link>
                                        <Link to={`/detail/${index}`}>
                                            <AiOutlineEye className="w-9 h-9 rounded-full bg-white p-2" />
                                        </Link>
                                    </div>
                                    <Link to={`/cart/${index}`}>
                                        <button 
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2
                                            bg-black text-white font-semibold py-2 px-6 add-to-cart z-10 w-[310px]">
                                            Add To Cart
                                        </button>
                                    </Link>
                                </div>
                                <div>
                                    <h3 className="mt-4 font-semibold text-gray-800">{product.name}</h3>
                                    <div className="mt-2 text-red-500 font-semibold text-lg">
                                        ${product.price}
                                        {product.oldPrice && <span className="text-gray-500 line-through text-sm ml-2">${product.oldPrice}</span>}
                                    </div>
                                    <div className="flex items-center mt-2 text-yellow-300">
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar key={i} className="w-5 h-5 hover:text-yellow-500" />
                                        ))}
                                        <span className="ml-2 mb-0.5 text-gray-600">(65)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>      
        </>
    );
}

export default DetailProduct