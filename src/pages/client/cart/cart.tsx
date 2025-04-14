import { useContext } from 'react';
import { Table, Button, Image, Popconfirm, message } from 'antd';
import { cartContext } from '../../../conText/cartContext';
import { ICartProduct } from '../../../inface/cart';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CartClient = () => {
  const { cartstate } = useContext(cartContext)

  const nav = useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation({
      mutationFn: async (id: number) => {
          try {
              await axios.delete(`http://localhost:3000/carts/${id}`)
          } catch (error) {
              console.log(error)
              throw error
          }
      },
      onSuccess: () => {
          message.success('Xóa thành công')
          queryClient.invalidateQueries({ queryKey: ['carts'] })
      },
      onError: () => {
        message.error("Xoa that bai")
        console.log(Error)
      }
  })

  const onDeleteCart = (id: number) => {
      mutation.mutate(id)
  }

  // Cột của bảng giỏ hàng
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (_: any, __: ICartProduct, index:any) => index + 1
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_: any, record: ICartProduct) => (
        <Image
          src={record.productId?.image}
          alt={record.productId?.name}
          width={80}
          height={80}
          style={{ objectFit: 'cover', borderRadius: 5 }}
          preview={false}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: ICartProduct) => record.productId?.name,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: ICartProduct) => record.quantity,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (_: any, record: ICartProduct) => (
        <span>{record.productId?.price?.toLocaleString()}đ</span>
      ),
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_: any, record: ICartProduct) => (
        <span>{(record.productId?.price * record.quantity).toLocaleString()}đ</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'id',
      dataIndex: 'id',
      render: (_: any, record: ICartProduct) => (
        <div className='flex justify-center items-center'>
          <Button className='mr-2' type="primary" onClick={() => nav(`/admin/edit/${record.productId?.id}`)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Thông báo!!!"
            description="Bạn chắc chắn xóa chứ?"
            onConfirm={() => onDeleteCart(record.productId?.id)} // Sử dụng đúng ID ở đây
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      )
      
  },
  ];

  // Tính tổng giỏ hàng
  const total = cartstate.carts.reduce(
    (sum: number, item: ICartProduct) =>
      sum + (item.productId?.price || 0) * item.quantity,
    0
  )

  const onOrder = () => {
    nav('/checkout')
  }

  return (
    <div className="px-24 py-4">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>
      {cartstate.carts.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <Table
            dataSource={cartstate.carts}
            columns={columns}
            rowKey={(record) => record.productId.id}
            pagination={false}
          />
          <div className="flex justify-end mt-4 text-lg font-semibold">
            Tổng cộng: <span className="ml-2 text-red-500">{total.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button type="default">Tiếp tục mua sắm</Button>
            <Button onClick={onOrder} type="primary">Thanh toán</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartClient
