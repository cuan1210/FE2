import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { message } from "antd";
import { User } from "../../../inface/user";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>();

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: User) => {
            const res = await axios.post(`http://localhost:3000/login`, data);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user)); // Thêm dòng này
            message.success("Đăng nhập thành công");
            navigate("/");
        },        
        onError: () => {
            message.error("Email hoặc mật khẩu không đúng");
        }
    });

    const onLogin = (data: User) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex h-screen w-full px-24 py-8">
            {/* Hình ảnh bên trái */}
            <div className="flex-1 flex justify-center items-center bg-blue-100 rounded">
                <div className="w-[550px] h-[300px] flex justify-center items-center bg-gray-300 text-gray-600 text-sm text-center rounded-lg">
                    <img className="w-[550px] h-[380px] rounded" src="/src/assets/banner_login.jpeg" alt="Lỗi ảnh" />
                </div>
            </div>

            {/* Form đăng nhập */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white p-10">
                <div className="mb-4 mr-10 text-center">
                    <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                        Log in to EXCLUSIVE
                    </h2>
                    <h4 className="text-gray-600">Enter your details below</h4>
                </div>

                <form onSubmit={handleSubmit(onLogin)} className="w-full max-w-xs">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email or Phone Number"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("email", {
                                required: "Không được để trống email",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Vui lòng nhập đúng định dạng email",
                                },
                            })}
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("password", {
                                required: "Không được để trống password",
                            })}
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-red-500 text-white font-bold text-base rounded-md hover:bg-red-600 transition-colors"
                    >
                        Log In
                    </button>
                </form>

                <div className="flex gap-8 mt-4 text-sm">
                    <Link to="#" className="text-red-500 hover:underline">
                        Forget Password?
                    </Link>
                    <Link to="/register" className="text-red-500 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
