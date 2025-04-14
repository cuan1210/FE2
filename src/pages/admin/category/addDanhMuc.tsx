import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createData } from "../../../services/data"
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

function AddDanhMuc() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<ICategory>()

    const nav = useNavigate()

    const mutation = useMutation({
        mutationFn: async (data: ICategory) => {
            try {
                const { data: product } = await createData<ICategory>({
                    route: "category",
                    data: data
                })
                return product
            } catch (error) {
                console.log(error)
            }
        },
        onSuccess: () => {
            message.success('Thêm thành công')
            nav('/admin/listDanhMuc')
        }
    })

    const onSubmit = (data: ICategory) => {
        mutation.mutate(data)
    }

    return (
        <div className='w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md'>
            <h1 className='text-2xl font-semibold text-center mb-4'>Thêm mới danh mục</h1>
            
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                
                <div>
                    <label className='block text-gray-700 font-medium'>Tên danh mục:</label>
                    <input 
                        type='text' 
                        placeholder="Nhập tên danh mục" 
                        {...register("name", 
                                { required: "Tên danh mục không được để trống" }
                            )
                        } 
                        className='w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                    {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                </div>

                
                <div>
                    <label className='block text-gray-700 font-medium'>Mô tả:</label>
                    <input 
                        type='text' 
                        placeholder="Nhập mô tả" 
                        {...register("description",
                             { required: "Mô tả không được để trống" }
                            )
                        } 
                        className='w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                    {errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
                </div>

                
                <div>
                    <label className='block text-gray-700 font-medium'>Chọn Icon:</label>
                    <select 
                        {...register("icon",
                             { required: "Vui lòng chọn một icon" }
                            )
                        } 
                        defaultValue="" 
                        className='w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500'
                    >
                        <option value="">-- Chọn icon --</option>
                        {Object.keys(icons).map(iconKey => (
                            <option key={iconKey} value={iconKey}>{iconKey}</option>
                        ))}
                    </select>
                    {errors.icon && <p className='text-red-500 text-sm'>{errors.icon.message}</p>}
                </div>

                
                <button type="submit" className='bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition'>Thêm mới</button>
            </form>
        </div>
    )
}

export default AddDanhMuc
