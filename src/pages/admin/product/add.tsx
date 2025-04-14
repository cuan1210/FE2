import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../../inface/product";
import { createData } from "../../../services/data";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";
import { ListCategory } from "../../../services/category";
import { ICategory } from "../../../inface/category";

function AddP() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IProduct>()
  const nav = useNavigate()

  const {data: categoryRes} = useQuery({
    queryKey: ['category'],
    queryFn: async () => ListCategory('category')
  })

  const category: ICategory[] = categoryRes?.data || []

  const mutation = useMutation({
    mutationFn: async (data: IProduct) => {
      try {
        const { data: product } = await createData<IProduct>({ route: "products", data: data })
        return product
      } catch (error) {
        console.log(error)
      }
    },
    onSuccess: () => {
      message.success("Thêm thành công")
      nav("/admin/list");
    },
  });

  const onSubmit = (data: IProduct) => {
    mutation.mutate(data)
  }

  const [image,setImage] = useState<string>("")
  const [ablumImage,setAblumImage] = useState<string[]>([])
  const [loading,setLoading] = useState<boolean>(false)
  const [ablumLoading,setAblumLoading] = useState<boolean>(false)

  // Upload ảnh chính
  const upLoadImage = async  (file:FileList | null) => {
    if (!file) return;
    setLoading(true)
    const formData = new FormData()
    formData.append('file',file[0])
    formData.append('upload_preset','asm_fe2')
    const endPoint = 'https://api.cloudinary.com/v1_1/dy0gx6iz7/image/upload'
    try {
      const { data } = await axios.post(endPoint,formData)
      reset({
        image: data.url
      })
      setImage(data.url)
      setLoading(false)
    } catch (error) {
      // console.log(error)
      message.error("loi")
    }
  }

  // Upload ảnh ablum
  const upLoadAblumImage = async (file:FileList | null) => {
    if (!file) return
    setAblumLoading(true)
    const urls: string[] = []
    
    const uploadPromises = Array.from(file).map(async (file) => {
      try {
        const formData = new FormData()
        formData.append('file',file)
        formData.append('upload_preset','asm_fe2')
        const endPoint = 'https://api.cloudinary.com/v1_1/dy0gx6iz7/image/upload'

        const { data } = await axios.post(endPoint,formData)
        urls.push(data.url)
        } catch (error) {
        message.error("Loi ablum")
      }
    })

    try {
      await Promise.all(uploadPromises)
      const imageUrl = [...ablumImage,...urls]
      setAblumImage(imageUrl)
      reset({
        AblumImage: imageUrl
      })
      setAblumLoading(false)
    } catch (error) {
      message.error("Loi upload ablum")
      setAblumLoading(false)
    }
  }

  const removeImage = (index: number) => {
    const updated = [...ablumImage]
    updated.splice(index, 1)
    setAblumImage(updated)
    reset({ AblumImage: updated }) 
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center text-red-500 mb-4">Thêm mới sản phẩm</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-gray-700">Tên sản phẩm:</label>
            <input 
              className="border p-2 rounded" 
              type="text" 
              {...register("name", 
                  { required: "Tên sản phẩm không được để trống" }
                )
              } 
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <label className="text-gray-700">Hình ảnh chính:</label>
            <input type="file" onChange={(e)=>upLoadImage(e.target.files)} />
              {(loading)&&<>Đang tải ảnh...</>}
              {(image!="") && <img src={image} width={120}/> }
            <input 
              className="border p-2 rounded" 
              type="hidden" 
              {...register("image", 
                  { required: "Hình ảnh không được để trống" }
                )
              } 
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

            <label className="text-gray-700">Hình ảnh phụ:</label>
            <input type="file" multiple onChange={(e) => upLoadAblumImage(e.target.files)} />
            {ablumLoading && <p>Đang tải ảnh...</p>}

            <div className="flex gap-2 flex-wrap mt-2">
              {ablumImage.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} width={100} className="rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <input
              type="hidden"
              {...register("AblumImage", { required: "Ảnh phụ không được để trống" })}
            />
            {errors.AblumImage && <p className="text-red-500 text-sm">{errors.AblumImage.message}</p>}

        <label className="text-gray-700">Giá:</label>
            <input 
              className="border p-2 rounded" 
              type="number" 
              {...register("price", 
                  { required: "Giá không được để trống",
                  min: { value: 1000, message: "Giá phải lớn hơn 1000" } 
                  }
                )
              } 
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <label className="text-gray-700">Màu sắc:</label>
            <input 
              className="border p-2 rounded" 
              type="color" 
              {...register("coler", 
                  { required: "Màu sắc không được để trống" }
                )
              } 
            />
            {errors.coler && <p className="text-red-500 text-sm">{errors.coler.message}</p>}

        <label className="text-gray-700">Kích thước:</label>
            <select className="border p-2 rounded" 
              {...register("size", 
                  { required: "Vui lòng chọn kích thước" }
                )
              }
            > 
              <option value="">Vui lòng chọn kích thước</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
            {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}

        <label className="text-gray-700">Đánh giá:</label>
            <input 
              className="border p-2 rounded"
              type="number" 
              {...register("rating", 
                  { 
                    required: "Vui lòng chọn đánh giá",
                    min: { value: 0, message: "Đánh giá phải từ 0 đến 5" },
                    max: { value: 5, message: "Đánh giá phải từ 0 đến 5" }
                  }
                )
              } 
              />
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}

        <label className="text-gray-700">Số lượng</label>
            <input 
              className="border p-2 rounded" 
              type="number" 
              {...register("quantity", 
                    { 
                      required: "Vui lòng chọn số lượng",
                      min: { value: 0, message: "Số lượng không được âm" } 
                    }
                )
              } 
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}

        <label className="text-gray-700">Mô tả:</label>
            <textarea 
            className="border p-2 rounded" 
              {...register("description", 
                  { required: "Mô tả không được để trống" }
                )
              } 
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <label className="text-gray-700">Trạng thái:</label>
            <select 
            className="border p-2 rounded" 
              {...register("status", 
                  { required: "Vui lòng chọn trạng thái" }
                )
              }
            > 
              <option value="">Vui lòng chọn trạng thái</option>
              <option value="inStock">Còn hàng</option>
              <option value="offStock">Hết hàng</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}

          <label className="text-gray-700">Danh muc:</label>
          <select 
          className="border p-2 rounded" 
            {...register("category", 
                { required: "Vui lòng chọn trạng thái" }
              )
            }
          > 
            <option value="">Vui lòng chọn danh muc</option>
            {category.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Thêm mới</button>
      </form>
    </div>
  )
}

export default AddP
