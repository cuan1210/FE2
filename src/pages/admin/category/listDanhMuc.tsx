import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, message, Popconfirm, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ListData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";
import { useState } from "react";

const iconMap: { [key: string]: JSX.Element } = {
    FaMobileAlt: <FaMobileAlt />, FaLaptop: <FaLaptop />, FaClock: <FaClock />,
    FaCamera: <FaCamera />, FaHeadphones: <FaHeadphones />, FaGamepad: <FaGamepad />
};

const ListDanhMuc = () => {
    const { data = [] , isLoading } = useQuery<ICategory[]>({
        queryKey: ['category'],
        queryFn: async () => {
            try {
                const response = await ListData("category");
                return response.data;
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    });

    const nav = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                await axios.delete(`http://localhost:3000/category/${id}`);
            } catch (error) {
                console.error(error);
            }
        },
        onSuccess: () => {
            message.success("Xóa thành công");
            queryClient.invalidateQueries({ queryKey: ['category'] });
        }
    });

    const handleDelete = (id: number) => {
        mutation.mutate(id);
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (_: any, __: ICategory, index: number) => index + 1
        },
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (icon: string) => iconMap[icon] || "Lỗi icon"
        },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: ICategory) => (
                <>
                    <Button className='mr-2' type="primary" onClick={() => nav(`/admin/editDanhMuc/${record.id}`)}>
                        <EditOutlined /> 
                    </Button>
                    <Popconfirm
                        title="Thông báo"
                        description="Bạn chắc chứ?"
                        icon={<DeleteOutlined />}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3

    const displayedProducts = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl text-center font-bold text-blue-600 mb-4">Danh sách danh mục</h1>
            {isLoading ? <div>Đang tải...</div> : <Table dataSource={displayedProducts} columns={columns} rowKey="id" bordered pagination={false}/>}

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
    );
}

export default ListDanhMuc;
