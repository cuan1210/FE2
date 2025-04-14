import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaUser, FaCartPlus, FaHeart } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import { IProduct } from "../../inface/product";
import { api } from "../../services/data";
import { cartContext } from "../../conText/cartContext";
import { ICartProduct, TypeCart } from "../../inface/cart";
import axios from "axios";
import { message } from "antd";

function ClientHeader() {
    const { register, handleSubmit, watch } = useForm();
    const keywords = watch("keywords", "");
    const nav = useNavigate();

    const [products, setProducts] = useState<IProduct[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const userRef = useRef<HTMLLIElement>(null);

    // và sau đó:
    <li ref={userRef} className="relative">...</li>
    
    const isLoggedIn = !!localStorage.getItem("token");

    const onSearch = (data: any) => {
        const { keywords } = data;
        if (keywords.trim()) {
            nav(`/search?keyword=${keywords}`);
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (keywords.trim()) {
                api.get(`/products?name_like=${keywords}`)
                    .then(({ data }) => setProducts(data))
                    .catch((err) => console.log(err));
            } else {
                setProducts([]);
            }
        }, 400);
        return () => clearTimeout(delay);
    }, [keywords]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                formRef.current && !formRef.current.contains(e.target as Node) &&
                userRef.current && !userRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        nav("/");
        message.success("dang xuat thanh cong")
    }

    const {cartstate,dispatch} = useContext(cartContext)
     useEffect(()=>{
         (async()=>{
             try {
                 const token = localStorage.getItem("token")
                 const config = {
                     headers: {'Authorization':`Bearer ${token}`}
                 }
                 const {data} = await axios.get(`http://localhost:3000/carts`,config)
                 dispatch({type:TypeCart.updateCart,payload:data.data.Items})
             } catch (error) {
                 
             }
         })()
     },[])

    return (
        <header className="border">
            <div className="max-w-8xl mx-auto flex items-center justify-between px-24">
                {/* Logo */}
                <div className="pr-[150px] font-bold text-2xl">
                    <Link to="/">Exclusive</Link>
                </div>

                {/* Nav */}
                <nav>
                    <ul className="flex gap-6 py-4 text-[18px] px-[110px]">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </nav>

                {/* Search + icons */}
                <div className="flex items-center gap-4">
                    <form
                        ref={formRef}
                        className="relative"
                        onSubmit={handleSubmit(onSearch)}
                        onFocus={() => setShowDropdown(true)}
                    >
                        <input
                            {...register("keywords")}
                            className="text-black border outline-none px-5 py-1 rounded w-[200px]"
                            type="text"
                            placeholder="Tìm kiếm..."
                        />
                        <button type="submit" className="absolute right-2 top-2">
                            <CiSearch className="w-5 h-5" />
                        </button>

                        {showDropdown && products.length > 0 && (
                            <ul className="absolute bg-white border w-full max-h-[200px] overflow-y-auto z-10 shadow-md">
                                {products.map((product) => (
                                    <li key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                                        <Link to={`/detail/${product.id}`} onClick={() => setShowDropdown(false)}>
                                            {product.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>

                    <ul className="flex gap-1 items-center">
                        <li>
                            <Link to="/login">
                                <FaHeart className="w-5 h-5 mt-1 cursor-pointer hover:text-red-500" />
                            </Link>
                        </li>
                        <li>
                        <button
                            onClick={() => {
                            if (!isLoggedIn) {
                                message.warning("Vui lòng đăng nhập để xem giỏ hàng!");
                                nav("/login");
                            } else {
                                dispatch({ type: TypeCart.openSidebar, payload: true });
                            }
                            }}
                        >
                            <div className="flex mt-1">
                            <FaCartPlus className="w-5 h-5 mt-1 cursor-pointer hover:text-green-500" />
                            ({cartstate.carts.reduce((total: any, item: ICartProduct) => total + item.quantity, 0)})
                            </div>
                        </button>
                        </li>

                        {isLoggedIn && (
                            <li ref={userRef} className="relative">
                                <FaUser
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="w-5 h-5 mt-1 cursor-pointer hover:text-blue-500"
                                />
                                {showUserMenu && (
                                    <ul className="absolute right-0 mt-2 w-[150px] bg-white border shadow-md rounded z-10">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <Link to="/order">Đơn hàng</Link>
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default ClientHeader;
