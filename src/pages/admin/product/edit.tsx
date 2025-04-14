import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IProduct } from "../../../inface/product";
import { message } from "antd";
import { useState, useEffect } from "react";
import { ListCategory } from "../../../services/category";
import { ICategory } from "../../../inface/category";

function EditP() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IProduct>()

    const params = useParams()

    const nav = useNavigate()

    const {data: categoryRes, isLoading: categoryLoading} = useQuery({
      queryKey: ['category'],
      queryFn: async () => ListCategory('category')
    })
  
    const category: ICategory[] = categoryRes?.data || []

    const { data, isLoading: productLoading } = useQuery<IProduct>({
        queryKey: ['products', params.id],
        queryFn: async () => {
            try {
                const { data: product } = await axios.get(`http://localhost:3000/products/${params.id}`);
                reset(product);  
                return product;
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                throw error;
            }
        }
    });

    const mutation = useMutation({
        mutationFn: async (updatedData: IProduct) => {
            try {
                const { data: product } = await axios.put(`http://localhost:3000/products/${params.id}`, updatedData);
                return product;
            } catch (error) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
            }
        },
        onSuccess: () => {
            message.success('Cập nhật thành công');
            nav('/admin/list');
        }
    });

    const [image, setImage] = useState<string>(data?.image || "")
    const [ablumImage,setAblumImage] = useState<string[]>(data?.AblumImage || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [ablumLoading,setAblumLoading] = useState<boolean>(false)

    const upLoadImage = async (file: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file[0]);
        formData.append('upload_preset', 'asm_fe2');
        const endPoint = 'https://api.cloudinary.com/v1_1/dy0gx6iz7/image/upload'
        try {
            const { data } = await axios.post(endPoint, formData)
            setImage(data.url)
            setLoading(false)
        } catch (error) {
            console.log(error)
            message.error("Lỗi khi tải ảnh")
            setLoading(false)
        }
    }

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

    useEffect(() => {
        if (data) {
            setImage(data.image),
            setAblumImage(data.AblumImage || [])
        }
    }, [data])

    const onSubmit = (formData: IProduct) => {
        const updatedProduct = { ...formData, image };
        mutation.mutate(updatedProduct);
    }

    const isLoading = categoryLoading || productLoading;

    if (isLoading) {
        return <p>Đang tải dữ liệu...</p>;
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
    
            <label className="text-gray-700">Hình ảnh:</label>
                <input type="file" onChange={(e)=>upLoadImage(e.target.files)} />
                    {loading && <p>Đang tải ảnh...</p>}
                    {image && <img src={image} width={120} alt="product" />}
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

                <label className="text-gray-700">Danh mục:</label>
          <select 
          className="border p-2 rounded" 
            {...register("category", 
                { required: "Vui lòng chọn trạng thái" }
              )
            }
          > 
            <option value="">Vui lòng chọn danh mục</option>
            {category.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
    
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Cập nhật</button>
          </form>
        </div>
      )
}

export default EditP
