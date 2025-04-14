import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, message, Pagination, Popconfirm, Table } from 'antd'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { IProduct } from '../../../inface/product'
import { ListData } from '../../../services/data'
import { useEffect, useState } from 'react'
import { ICategory } from '../../../inface/category'

const ProductList = () => {
    const { data = [] , isLoading } = useQuery<IProduct[]>({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                const response = await ListData('products')
                return response.data
            } catch (error) {
                console.log(error)
            }
        },
    })

    const [categories, setCategories] = useState<ICategory[]>([])

    useEffect(() => {
        fetch('http://localhost:3000/category')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(error => console.log(error))
    }, [])


    const nav = useNavigate()

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                await axios.delete(`http://localhost:3000/products/${id}`)
            } catch (error) {
                console.log(error)
            }
        },
        onSuccess: () => {
            message.success('Xóa thành công')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const DeleteProduct = (id: number) => {
        mutation.mutate(id)
    }

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_: any, __: IProduct, index: number) => (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => <img src={image} style={{height: '50px'}} />,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`, 
        },       
        {
            title: 'Danh mục',
            dataIndex: 'category', 
            key: 'category',
            render: (categoryId: number | string) => { 
                const category = categories.find((c: ICategory) => c.id === Number(categoryId));
                return category ? category.name : 'Không xác định';
            },
        },        
        {
            title: 'Thao tác',
            key: 'id',
            dataIndex: 'id',
            render: (id: number) => (
                <>
                    <div className='flex justify-center items-center'>
                        <Button className='mr-2' type="primary" onClick={() => nav(`/admin/edit/${id}`)}>
                            <EditOutlined />
                        </Button>
                        <Button className='mr-2'  onClick={() => nav(`/admin/detail/${id}`)}>
                            <EyeOutlined />
                        </Button>
                        <Popconfirm
                            title="Thông báo!!!"
                            description="Bạn chắc chắn xóa chứ?"
                            onConfirm={() => DeleteProduct(id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>
                                <DeleteOutlined /> 
                            </Button>
                        </Popconfirm>
                    </div>
                </>
            ),
        },
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4

    const displayedProducts = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='bg-white px-4 py-2'>
            <h1 className='text-[24px] text-center pb-4'>Danh sách sản phẩm</h1>
            {(isLoading) ? <div>Đang tải...</div> : 
            <Table dataSource={displayedProducts} columns={columns} rowKey="id" pagination={false} />
            }

            <div className="flex justify-center items-center mt-6 space-x-2 mb-4">
                <Pagination
                    current={currentPage}
                    total={data.length}
                    pageSize={itemsPerPage}
                    onChange={onPageChange}
                    showSizeChanger={false}
                />
            </div>

            
        </div>
    )
}

export default ProductList
