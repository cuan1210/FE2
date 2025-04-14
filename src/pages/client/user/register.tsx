import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../../../inface/user";
import { message } from "antd";

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<User>();

    const nav = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: User) => {
            try {
                await axios.post(`http://localhost:3000/register`, data);
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            message.success("Đăng ký thành công");
            nav('/login');
        },
        onError: (error) => {
            message.error("Đăng ký thất bại. Vui lòng thử lại hoặc kiểm tra email đã tồn tại.");
            console.error("Đăng ký thất bại:", error);
        }
    });

    const onRes = (data: User) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex h-screen w-full px-24 py-8">
            {/* img bên */}
            <div className="flex-1 flex justify-center items-center bg-blue-100 rounded">
                <div className="w-[550px] h-[300px] flex justify-center items-center bg-gray-300 text-gray-600 text-sm text-center rounded-lg">
                    <img className="w-[550px] h-[380px] rounded" src="/src/assets/banner_login.jpeg" alt="Lỗi ảnh" />
                </div>
            </div>

            {/* Form đăng ký */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white p-10">
                <div className="mb-4 mr-5">
                    <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                        Register to EXCLUSIVE
                    </h2>
                    <h4 className="">Enter your details below</h4>
                </div>
                <form onSubmit={handleSubmit(onRes)} className="w-full max-w-xs">
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("name", { required: "Không được để trống tên" })}
                        />
                        <span className="text-red-500">{errors.name?.message}</span>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            id="address"
                            placeholder="Address"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("address", { required: "Không được để trống địa chỉ" })}
                        />
                        <span className="text-red-500">{errors.address?.message}</span>
                    </div>

                    <div className="mb-4">
                        <input
                            type="number"
                            id="phone"
                            placeholder="Phone Number"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("phone", {
                                required: "Không được để trống số điện thoại",
                                minLength: {
                                    value: 10,
                                    message: "Số điện thoại phải có ít nhất 10 chữ số"
                                }
                            })}
                        />
                        <span className="text-red-500">{errors.phone?.message}</span>
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            placeholder="Email or Phone Number"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("email", {
                                required: "Không được để trống email",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Vui lòng nhập đúng định dạng email"
                                }
                            })}
                        />
                        <span className="text-red-500">{errors.email?.message}</span>
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                            {...register("password", {
                                required: "Không được để trống mật khẩu"
                            })}
                        />
                        <span className="text-red-500">{errors.password?.message}</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            {...register("role")}
                            className="w-full p-3 text-base border border-gray-300 rounded-md"
                        >
                            <option value="false">User</option>
                            <option value="true">Admin</option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="w-full p-3 bg-red-500 text-white font-bold text-base rounded-md hover:bg-red-600 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <div className="mr-[260px] mt-2 font-semibold">
                    <Link to="/login" className="mt-3 text-red-500 text-sm hover:underline">
                        Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register
