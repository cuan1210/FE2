import { useContext } from 'react';
import { ICartProduct, TypeCart } from '../../../inface/cart';
import { cartContext } from '../../../conText/cartContext';
import { Drawer, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; 

const ProductCartSidebar = () => {
    const { cartstate, dispatch } = useContext(cartContext);
    const navigate = useNavigate(); 

    const onClose = () => {
        dispatch({ type: TypeCart.openSidebar, payload: false });
    };

    const handleViewCart = () => {
        onClose(); 
        navigate('/cart'); 
    };

    return (
        <Drawer
            title="Giỏ Hàng"
            placement="right"
            onClose={onClose}
            open={cartstate.isOpenSidebar}
            width={400}
            footer={
                <div className="mt-6 flex justify-between gap-4">
                    <Button type="default" block onClick={handleViewCart}>
                        Xem giỏ hàng
                    </Button>
                    <Button type="primary" block onClick={() => {
                        onClose(); 
                        navigate('/checkout'); 
                    }}>
                        Thanh toán
                    </Button>
                </div>
            }
        >
            <ul className="space-y-4">
                {cartstate.carts && cartstate.carts.length > 0 ? (
                    cartstate.carts.map((item: ICartProduct, index: any) => (
                        <li key={index} className="flex items-center space-x-4">
                            <img
                                src={item.productId?.image || 'placeholder-image-url'}
                                alt={item.productId?.name || 'Sản phẩm không xác định'}
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <div className="font-semibold">{item.productId?.name || 'Tên không xác định'}</div>
                                <div className="text-sm text-gray-600">
                                    SL: {typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0}
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>Giỏ hàng trống</li>
                )}
            </ul>
          
        </Drawer>
    );
};

export default ProductCartSidebar
