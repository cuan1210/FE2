import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { ICategory } from "../../../inface/category"
import { message } from "antd"
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa"

const icons = {
    FaMobileAlt: <FaMobileAlt />,
    FaLaptop: <FaLaptop />,
    FaClock: <FaClock />,
    FaCamera: <FaCamera />,
    FaHeadphones: <FaHeadphones />,
    FaGamepad: <FaGamepad />
}

function EditDanhMuc() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ICategory>()

    const params = useParams()
    const nav = useNavigate()

    const { data, isLoading } = useQuery<ICategory>({
        queryKey: ['category', params.id],
        queryFn: async () => {
            try {
                const { data: category } = await axios.get(`http://localhost:3000/category/${params.id}`)
                reset(category)
                return category
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error)
                throw error
            }
        }
    })

    const mutation = useMutation({
        mutationFn: async (updatedData: ICategory) => {
            try {
                const { data: product } = await axios.put(`http://localhost:3000/category/${params.id}`, updatedData)
                return product
            } catch (error) {
                console.error("Lỗi khi cập nhật danh mục:", error)
            }
        },
        onSuccess: () => {
            message.success('Cập nhật thành công')
            nav('/admin/listDanhMuc')
        }
    })

    const onSubmit = (data: ICategory) => {
        mutation.mutate(data)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl text-center font-bold text-blue-600 mb-4">Cập nhật danh mục</h1>

            {isLoading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}

            {data && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block font-medium">Tên danh mục</label>
                        <input 
                            type="text" 
                            className="border p-2 w-full rounded-md" 
                            {...register("name", 
                                { required: "Tên danh mục không được để trống" }
                                )
                            } 
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Mô tả</label>
                        <input 
                            type="text" 
                            className="border p-2 w-full rounded-md" 
                            {...register("description",
                                 { required: "Mô tả không được để trống" }
                                )
                            } 
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Chọn Icon</label>
                        <select 
                            {...register("icon", 
                                    { required: "Vui lòng chọn icon" }
                                )
                            }
                            className="border p-2 w-full rounded-md"
                        >
                            <option value="">Chọn icon</option>
                            {Object.keys(icons).map(iconKey => (
                                <option key={iconKey} value={iconKey}>{iconKey}</option>
                            ))}
                        </select>
                        {errors.icon && <p className="text-red-500 text-sm">{errors.icon.message}</p>}
                    </div>

                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                        Cập nhật
                    </button>
                </form>
            )}
        </div>
    )
}

export default EditDanhMuc
